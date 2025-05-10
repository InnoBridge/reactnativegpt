import { SQLiteDatabase } from "expo-sqlite"
import { enums } from "@innobridge/llmclient";
import { ChatMessageProps } from "@/components/ChatMessage";
import * as FileSystem from "expo-file-system";

const { Role } = enums;

export const executeAsync = async (db: SQLiteDatabase, query: string) => {
    return await db.execAsync(query);
};

export const runAsync = async (db: SQLiteDatabase, query: string, params: any[] = []) => {
    return await db.runAsync(query, params);
};

export const getAllAsync = async (db: SQLiteDatabase, source: string, params: any[] = []) => {
    return await db.getAllAsync(source, params);
};

const createChatsTable = async (db: SQLiteDatabase) => {
    // Create chats table with timestamp
    return await executeAsync(db, 
        `CREATE TABLE chats (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            created_at INTEGER DEFAULT (unixepoch())
        );
    `);
};

const createMessagesTable = async (db: SQLiteDatabase) => {
    // Create messages table with timestamp
    return await executeAsync(db,
        `CREATE TABLE messages (
            id INTEGER PRIMARY KEY NOT NULL,
            chat_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            imageUrl TEXT,
            role TEXT NOT NULL,
            prompt TEXT,
            created_at INTEGER DEFAULT (unixepoch()),
            FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
        );
    `);
}

enum Transaction {
    BEGIN = 'BEGIN',
    COMMIT = 'COMMIT',
    ROLLBACK = 'ROLLBACK'
};

export const beginTransaction = async (db: SQLiteDatabase) => { 
    return await executeAsync(db, `${Transaction.BEGIN};`);
};

export const commitTransaction = async (db: SQLiteDatabase) => { 
    return await executeAsync(db, `${Transaction.COMMIT};`);
};

export const rollbackTransaction = async (db: SQLiteDatabase) => { 
    return await executeAsync(db, `${Transaction.ROLLBACK};`);
};

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    console.log("migrateifneeded", FileSystem.documentDirectory);
    const DATABASE_VERSION = 1;
    
    let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    let currentDbVersion = result?.user_version ?? 0;

    if (currentDbVersion === 0) {
        try {            
            // Set SQLite mode and enable foreign keys
            await executeAsync(db, 'PRAGMA journal_mode = "wal";');
            await executeAsync(db, 'PRAGMA foreign_keys = ON;');
            
            // THEN begin transaction for schema creation
            await beginTransaction(db);

            // Create chats table with timestamp
            await createChatsTable(db);
            
            // Create messages table with timestamp
            await createMessagesTable(db);
            
            // Create indexes for better performance
            await executeAsync(db, 'CREATE INDEX idx_messages_chat_id ON messages(chat_id);');
            await executeAsync(db, 'CREATE INDEX idx_messages_role ON messages(role);');
            
            // Commit the transaction
            await commitTransaction(db);
            console.log("Database schema created successfully");
            
            currentDbVersion = 1;
        } catch (error) {
            // Rollback on any error
            await rollbackTransaction(db);
            console.error("Database migration failed:", error);
            throw error;
        }
    }

    await executeAsync(db, `PRAGMA user_version = ${DATABASE_VERSION}`);
}

export const addChat = async (db: SQLiteDatabase, title: string) => {
    try {
        return await runAsync(db, 'INSERT INTO chats (title) VALUES (?)', [title]);
    } catch (error) {
        console.error("Failed to add chat:", error);
        throw error;
    }
};

export const getChats = async (db: SQLiteDatabase) => {
    try {
        // Improved query that includes message counts and last message time
        return await getAllAsync(db, `
            SELECT c.*, 
                  (SELECT COUNT(*) FROM messages WHERE chat_id = c.id) as messageCount,
                  (SELECT MAX(created_at) FROM messages WHERE chat_id = c.id) as lastActivity
            FROM chats c
            ORDER BY lastActivity DESC, c.id DESC
        `);
    } catch (error) {
        console.error("Failed to get chats:", error);
        throw error;
    }
};

export const getMessages = async (db: SQLiteDatabase, chatId: number) => {
    try {
        // Fixed role mapping with proper parameter array
        const messages = await getAllAsync(db,
            'SELECT * FROM messages WHERE chat_id = ? ORDER BY id ASC', 
            [chatId]
        );
        
        return messages;
    } catch (error) {
        console.error(`Failed to get messages for chat ${chatId}:`, error);
        throw error;
    }
};

export const addMessage = async (
    db: SQLiteDatabase,
    chatId: number,
    { content, role, imageUrl, prompt }: ChatMessageProps
) => {
    try {
        // Fixed parameter array syntax
        return await runAsync(db,
            'INSERT INTO messages (chat_id, content, role, imageUrl, prompt) VALUES (?, ?, ?, ?, ?)',
            [chatId, content as string, role === Role.SYSTEM ? 'system' : 'user', imageUrl || '', prompt || '']
        );
    } catch (error) {
        console.error(`Failed to add message to chat ${chatId}:`, error);
        throw error;
    }
};

export const deleteChat = async (db: SQLiteDatabase, chatId: number) => {
    try {
        // Use transaction to ensure atomicity
        await beginTransaction(db);
        
        try {
            // Delete chat and rely on CASCADE for messages
            const result = await runAsync(db, 'DELETE FROM chats WHERE id = ?', [chatId]);
            await commitTransaction(db);
            return result;
        } catch (error) {
            await rollbackTransaction(db);
            throw error;
        }
    } catch (error) {
        console.error(`Failed to delete chat ${chatId}:`, error);
        throw error;
    }
};

export const renameChat = async (db: SQLiteDatabase, chatId: number, title: string) => {
    try {
        return await runAsync(db, 'UPDATE chats SET title = ? WHERE id = ?', [title, chatId]);
    } catch (error) {
        console.error(`Failed to rename chat ${chatId}:`, error);
        throw error;
    }
};
