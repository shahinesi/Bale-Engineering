# Bale Bot API: supported methods and object catalog

**Source verified:** 2026-11-25  
**Official source:** https://docs.bale.ai/

This page is a navigation map of the methods and object types listed in Bale's official Bot API documentation. It is not a substitute for each method's parameter table. Before implementation, read the method's exact parameter types, required fields, size limits and client compatibility notes in the official docs.

## Update delivery

| Method | Purpose |
|---|---|
| getUpdates | Receive updates through long polling |
| setWebhook | Configure an HTTPS webhook |
| deleteWebhook | Disable webhook delivery so getUpdates can be used |
| getWebhookInfo | Inspect current webhook state |

## Bot identity and basic messaging

| Method | Purpose |
|---|---|
| getMe | Validate the bot token and retrieve bot identity |
| sendMessage | Send text |
| forwardMessage | Forward an existing message with its origin context |
| copyMessage | Copy a message without linking to the original |
| sendPhoto | Send an image |
| sendAudio | Send an audio file for music-player presentation |
| sendDocument | Send a general file |
| sendVideo | Send an MPEG-4 video |
| sendAnimation | Send an animation |
| sendVoice | Send a voice message |
| sendMediaGroup | Send an album of photos/videos; audio and document are not supported in the documented media group |
| sendLocation | Send a location point |
| sendContact | Send a contact |
| sendChatAction | Show a chat action such as typing |
| getFile | Retrieve file metadata and a temporary download path |
| answerCallbackQuery | End the inline-button waiting state and optionally show feedback |
| askReview | Ask a user to review the bot; availability depends on client version |

## Chat membership and administration

| Method | Purpose |
|---|---|
| banChatMember | Ban a member |
| unbanChatMember | Unban a member |
| promoteChatMember | Change a member's administrator rights |
| setChatPhoto | Change a group's/channel's photo |
| leaveChat | Leave a chat |
| getChat | Retrieve chat information |
| getChatAdministrators | Retrieve administrators |
| getChatMembersCount | Retrieve member count |
| getChatMember | Retrieve one member's status |
| pinChatMessage | Pin a message |
| unPinChatMessage | Unpin one message |
| unpinAllChatMessages | Unpin all messages |
| setChatTitle | Change title |
| setChatDescription | Change description |
| deleteChatPhoto | Delete chat photo |
| createChatInviteLink | Create an invite link |
| revokeChatInviteLink | Revoke an invite link |
| exportChatInviteLink | Export the primary invite link |

## Topics, commands and message editing

| Method | Purpose |
|---|---|
| createForumTopic | Create a topic |
| editForumTopic | Edit a topic |
| deleteForumTopic | Delete a topic |
| setMyCommands | Replace the bot command list |
| getMyCommands | Retrieve the current command list |
| deleteMyCommands | Delete the command list |
| editMessageText | Edit message text |
| editMessageCaption | Edit a media caption |
| editMessageReplyMarkup | Edit inline keyboard markup |
| deleteMessage | Delete a message |

### Command-list caveat

Bale documents one command list per bot for all users. Telegram-style scope and language_code parameters are not supported. If multiple setMyCommands calls are sent concurrently, the final list may be combined; send these calls sequentially.

## Stickers

| Method | Purpose |
|---|---|
| uploadStickerFile | Upload a file for sticker-set operations |
| createNewStickerSet | Create a sticker set |
| addStickerToSet | Add a sticker to an existing set |

## Wallet payments and transaction inquiry

| Method | Purpose |
|---|---|
| sendInvoice | Send a wallet-payment invoice in chat |
| createInvoiceLink | Create a wallet invoice identifier for Mini Apps |
| answerPreCheckoutQuery | Accept or reject the pre-checkout request |
| inquireTransaction | Query the state of a transaction by its unique identifier |

The card-to-card payment request flow previously available in bots has been removed. The official page identifies wallet payments as the current supported method for receiving payments through the bot.

## Important object types

The official reference includes these object families:

- Identity and chat: User, Chat, ChatFullInfo, ChatMember and its owner/administrator/member/restricted variants.
- Messages: Message, MessageId, MessageEntity, ForumTopic, ForumTopicCreated.
- Media: PhotoSize, Animation, Audio, Document, Video, Voice, File, InputMedia and its photo/video/animation/audio/document variants, InputFile.
- User data: Contact, Location.
- Keyboards: ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton, style, ReplyKeyboardRemove, WebAppInfo, CopyTextButton.
- Interaction: CallbackQuery, WebAppData, BotCommand.
- Payments: Invoice, PreCheckoutQuery, SuccessfulPayment, LabeledPrice and Transaction.
- Errors: ResponseParameters.

Use the exact Bale object definitions. A Telegram library may expose fields that Bale does not support.

## File transport limits

Bale documents three ways to send files:

| Method | Image maximum | Other content maximum |
|---|---:|---:|
| Reuse an existing file_id | No upload limit documented for this method | No upload limit documented for this method |
| Send by HTTP URL | 5 MB | 20 MB |
| Upload with multipart/form-data | 10 MB | 50 MB |

Additional constraints:
- file_id is unique to a bot and cannot be transferred to another bot.
- Re-sending a file_id does not allow changing the media type.
- Thumbnails cannot be reused.
- URL-based sending requires a correct MIME type.
- sendDocument URL delivery is documented only for GIF, PDF and ZIP.
- sendVoice by URL requires audio/ogg and a size no greater than 1 MB to appear as a voice message; 1–20 MB is sent as a file.
- getFile currently supports downloading files up to 20 MB. The generated download URL is guaranteed for one hour; request a new URL after expiry.
- sendAudio accepts MP3 or M4A and currently supports up to 50 MB.
- sendDocument, sendVideo, sendAnimation and sendVoice currently document a 50 MB send limit. Limits may change.

Do not merge these limits with Safir's separate 500 MB upload_file limit.

## Client-version compatibility

- answerCallbackQuery was added to Bale clients from Khordad 1404. Older clients may not support it. The docs say callback_query_id beginning with 1 indicates an older client; provide an alternate user-visible message where needed.
- askReview is available in newer clients from Aban 1404; older clients may not display the review form.
- Check client support before relying on newer methods for a critical workflow.

## Payment safety

- answerPreCheckoutQuery must be called within 10 seconds; otherwise the payment is cancelled.
- Receiving pre_checkout_query does not mean payment succeeded.
- Fulfil an order only after receiving SuccessfulPayment and validating the associated invoice_payload and business state.
- inquireTransaction can return pending, paid, failed or rejected.
- The documented currency for wallet invoices is IRR and LabeledPrice.amount is an integer amount in rials.

## Business API is separate

See business-api.md. Its supported method list is limited to getMe, sendMessage, forwardMessage, sendPhoto, sendVideo, sendAudio and sendDocument. It has private-chat and file_id-only restrictions.

## Sources

- https://docs.bale.ai/ (supported methods, object types, file handling, business API and wallet payments)
