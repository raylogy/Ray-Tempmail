import { Email } from "../types";

const GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

/**
 * Fetches messages from Gmail.
 * @param accessToken OAuth2 Token
 * @param limit Number of messages
 * @param query Optional search query (e.g., 'to:user@domain.com')
 * @param includeSpam Whether to include messages from Spam and Trash
 */
export const fetchGmailMessages = async (
  accessToken: string, 
  limit: number = 10, 
  query?: string, 
  includeSpam: boolean = false
): Promise<Email[]> => {
  try {
    // 1. Prepare Query URL
    const queryParam = query ? `&q=${encodeURIComponent(query)}` : '';
    const url = `${GMAIL_API_BASE}/messages?maxResults=${limit}${queryParam}&includeSpamTrash=${includeSpam}`;

    let listResponse;
    try {
        listResponse = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
        });
    } catch (netErr) {
        throw new Error("NETWORK_ERROR");
    }

    if (listResponse.status === 401) {
        throw new Error("GMAIL_AUTH_ERROR");
    }

    if (!listResponse.ok) {
      const err = await listResponse.json().catch(() => ({}));
      throw new Error(`Gmail API Error: ${err.error?.message || listResponse.statusText}`);
    }

    const listData = await listResponse.json();
    const messages = listData.messages || [];

    // 2. Fetch details for each message (in parallel)
    const emailPromises = messages.map(async (msg: { id: string; threadId: string }) => {
      try {
          const detailResponse = await fetch(`${GMAIL_API_BASE}/messages/${msg.id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          });
          
          if (!detailResponse.ok) return null;
          
          const detail = await detailResponse.json();
          return parseGmailMessage(detail);
      } catch (e) {
          return null;
      }
    });

    const results = await Promise.all(emailPromises);
    return results.filter((e): e is Email => e !== null);

  } catch (error) {
    // Re-throw specific errors for the UI to handle
    throw error;
  }
};

const parseGmailMessage = (message: any): Email => {
  const headers = message.payload?.headers || [];
  
  const subjectHeader = headers.find((h: any) => h.name === 'Subject');
  const fromHeader = headers.find((h: any) => h.name === 'From');
  const dateHeader = headers.find((h: any) => h.name === 'Date');

  const senderRaw = fromHeader ? fromHeader.value : 'Unknown';
  // Simple regex to extract email from "Name <email@example.com>"
  const emailMatch = senderRaw.match(/<([^>]+)>/);
  const senderEmail = emailMatch ? emailMatch[1] : senderRaw;
  const senderName = senderRaw.split('<')[0].trim();

  // Decoding body (simplified for text/plain or text/html)
  let body = "No content";
  if (message.payload?.body?.data) {
     body = decodeBase64(message.payload.body.data);
  } else if (message.payload?.parts) {
      // Prioritize HTML, fallback to plain text
      const htmlPart = message.payload.parts.find((p: any) => p.mimeType === 'text/html');
      const textPart = message.payload.parts.find((p: any) => p.mimeType === 'text/plain');
      const part = htmlPart || textPart;
      
      if (part && part.body && part.body.data) {
          body = decodeBase64(part.body.data);
      }
  }

  return {
    id: message.id,
    sender: senderName || senderEmail,
    senderEmail: senderEmail,
    subject: subjectHeader ? subjectHeader.value : '(No Subject)',
    snippet: message.snippet || '',
    body: body,
    date: dateHeader ? new Date(dateHeader.value).toISOString() : new Date().toISOString(),
    read: !message.labelIds?.includes('UNREAD'),
    tags: message.labelIds || []
  };
};

function decodeBase64(data: string) {
    // Replace non-url compatible chars
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
    try {
        // Handle utf-8 characters correctly
        return decodeURIComponent(Array.prototype.map.call(atob(base64), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch (e) {
        return data;
    }
}