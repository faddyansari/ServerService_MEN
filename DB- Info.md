##Elastics IP and Route53 Tutorial
https://alestic.com/2009/06/ec2-elastic-ip-internal/
##MONGODB Installation on ARM64 Ubuntu 18.4 (Bionic)
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

##MONGODB Production Guide
https://docs.mongodb.com/manual/administration/production-notes/

#Shared Collections
1. Visitor 
    * AnalyticsService
    * ChatService
2. Messages
    * ChatService
    * AnalyticsService
3. Conversations
    * Chat Service
    * Analytics Service
4. Companies
    * Socket Server
    * Media Service
    * Ticket Service
    * Rest Api Service
    * Website
    * ChatBot

# DB - Chats/Bot (Collection Information)  
# A1 xLarge Done
    1. Conversations
    2. Messages
    3. Tags
    4. Left Visitors
    5. assignmentRules
    #(Bot Colletions)
    1. Actions
    2. Intents
    3. Regex
    4. RespFunc
    5. Stories
    6. Synonyms
    7. Tphrase
    8. Visitors

## Note (Visitor Are Temporarliy kept on same database since for current traffic A single database is enough but we will distribute it in future when needed)
# DB - Analytics (Collection Information) 
#A1 xLarge Done
DB - Analytics/Logging/Session Archiving / (Visitors - Contacts) Snapshots
    1.  VisitorSessions
    2.  AgentSessions
    3.  Visitors
    4.  Warehouse_agentAvgCRT
    5.  Warehouse_agentactivity
    6.  Warehouse_agentfcr
    7.  Warehouse_agentcfr
    8.  Warehouse_agentfeedback
    9.  Warehouse_avgwaittime
    10. Warehouse_chatduration
    11. Warehouse_firstticketresponse
    12. Warehouse_referers
    13. Warehouse_returningvisitors
    14. Warehouse_ticketresolutiontime
    15. Warehouse_totalchats
    16. Warehouse_totaltickets
    17. WareHouse_totalvisitors
    18. Warehouse_uniquevisitors 
    19. EventLogs

# DB - Tickets (Collection Information)
#A1 xLarge Done
DB - Tickets
    1.  Tickets
    2.  TicketMessages
    3.  EmailBlackList
    4.  EmailReceipants
    5.  EmailSignatures
    6.  TicketGroups
    7.  Teams
    8.  Emailsignatures
    9.  feedBackSurvey
    10. slaPolicy
    11. ticketScenarios
    12. ticketTemplate
    13. emailActivations
    14. ruleSets

# DB - Marketing (Collection Information) 
#T3A Medium - Done
DB - Marketing
    1. Faqs
    2. Promotions
    3. News
    4. Knowledgebase
    5. WidgetMarketing
    6. emailDesignTemplates
    7. emailLayouts

# DB - Companies (Collection Information) 
#T3A Medium Done
DB - Companies 
    1. Tokens
    2. iceServers
    3. mailingList
    4. defaultPermissions
    5. appTokensCAL
    6. Website Related Data
    7. Companies
    8. resellers
    9. CustomFields


## Note (Contacts Are Temporarliy kept on same database since for current traffic A single database is enough but we will distribute it in future when needed)
#T3A Medium is sufficient currently but we may Improve it T3-Large / A1 xLarge Depending on the Work we're performing. In-Progress (Murtaza)
DB - Agents / Contacts 
    1. Agents
    2. agentConversations
    3. agentConversationStatus
    4. contacts
    5. contactSessions
    6. contactConversations

# DB - In Memory (Sessions) 
# 3x T3 Small
DB - Session (Redis)
    1. Livesessions Write (Master)
    2. Livesessions Read - Replicate (Master/Slave)
    3. Livesessions Read - Replicate (Master/Slave)

# DB - Calls (Collection Information) 
DB - Calls (TBD)
