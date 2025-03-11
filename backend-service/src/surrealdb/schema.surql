// Define User Table
DEFINE TABLE user SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS cookieId ON user TYPE UUID;
DEFINE FIELD IF NOT EXISTS createdAt ON user TYPE datetime DEFAULT time::now() READONLY;
DEFINE INDEX IF NOT EXISTS userCookieId ON TABLE user COLUMNS cookieId UNIQUE;

// Define Conversation Table
DEFINE TABLE conversation SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS openAIId ON conversation TYPE string;
DEFINE FIELD IF NOT EXISTS createdAt ON conversation TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updatedAt ON conversation TYPE datetime DEFAULT time::now();
DEFINE INDEX IF NOT EXISTS conversationOpenAIId ON TABLE conversation COLUMNS openAIId UNIQUE;

// Define Topic Table
DEFINE TABLE topic SCHEMAFULL;
DEFINE FIELD label ON topic TYPE string;
DEFINE FIELD IF NOT EXISTS createdAt ON topic TYPE datetime DEFAULT time::now() READONLY;

// Define User & Conversation Relation Table
DEFINE TABLE user_has_conversation TYPE RELATION IN user OUT conversation;
DEFINE INDEX unique_user_has_conversation ON TABLE user_has_conversation COLUMNS in, out UNIQUE;

// Define Conversation & Topic Relation Table
DEFINE TABLE conversation_has_topic TYPE RELATION IN conversation OUT topic;
DEFINE INDEX unique_conversation_has_topic ON TABLE conversation_has_topic COLUMNS in, out UNIQUE;

// Define Topic to Topic Relation Table
DEFINE TABLE topic_relates_to_topic TYPE RELATION IN topic OUT topic;
DEFINE FIELD label ON topic_relates_to_topic TYPE string;
DEFINE INDEX unique_topic_relates_to_topic ON TABLE topic_relates_to_topic COLUMNS in, out UNIQUE;
