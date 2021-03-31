##Visitor Api Info

1.  "getConversations"
    @Body : { email : string; nsp: string;  }

2.  "getArchives"
    @Body : { email : string; nsp : string; filters:any }

3.  "getMoreArchives"
    @Body : { email : string; nsp : string; filters : any , chunk : string }

4. "getMoreinboxChats"
   @Body : { email : string; nsp : string; chunk : string }

5. "getArchiveMessages"
   @Body : { cid : string; }

6. "getMoreArchiveMessages"
   @Body : { cid : string; lastMessage : any }

7. "chatTagsList"
   @Body : { nsp : string }

8. "selectedConversationDetails"
   @Body : { cid : string }

9. "getLiveAgents"
   @Body : { nsp : string; csid : string; }

10. "customerConversationsList"
    @Body : { deviceID : string, nsp : string }

11. "moreCustomerConversationsList"
    @Body : { deviceID : string, id : string }

12. "changeState"
    @Body : { _id : string; state : string/number }

13. "disconnectEventFromClient"
    @Body : { _id : string;  }

14. "privateMessageRecieved"
    @Body : { cid : string; sessionid : string; }

15. "initiateChatForBot"
    @Body : { state : string; _id : string }

16. "typing"
    @Body : { sessionid : string; }

17. "updateAdditionalDataInfo"
    @Body : { sessionID : string; data : any }

18. "updateRequestedCarInfo"
    @Body : { sessionID : string; data : any }

19. "visitorSneakPeak"
    @Body : { _id : string; }

20. "getConversationClientID"
    @Body : { cid : string; _id : string; }

21. "getMessages"
    @Body : { cid : string; sessionID : string; }

22. "getMoreRecentChats"
    @Body : { sessionid : string; deviceID : string; }

23. "getSelectedChat"
    @Body : { sessionid : string; cid : string; }

24. "getFAQS"
    @Body : { sessionid : string; _id : string; nsp : string; text : string; }

25. "getPromotions"
    @Body : { sessionid : string;  }

26. "convertChatToTicket"
    @Body : { sessionid : string; thread : any; cid : string; }

27. "getAvailableAgents"
    @Body : { sessionid : string; }

28. "getWorkFlows"
    @Body : { sessionid : string; }

29. "workFlowInput"
    @Body : { sessionid : string; value : any; }

30. "updateCredentials"
    @Body : { sessionid : string; data : any; }

31. "updateUserInfo"
    @Body : { sessionid : string; data : any; }

32. "userinformation"
    @Body : { sessionid : string; data : any; }

33. "checkSID"
    @Body : { sid : string; }

34. "requestQueue"
    @Body : { sid : string; sessionid : string; nsp : string; }
    
35. "transferChat"
    @Body : { visitor : any; sessionid : string; }

36. "getFormsByNSP"
    @Body : { nsp : string; sessionid : string; }

37. "requestQueAuto"
    @Body : { sessionid : string; nsp : string; }

38. "endSupervisedChat"
    @Body : { sessionid : string; cid : string; }

39. "stopVisitorChat"
    @Body : { sessionid : string; conversation : any;  }

40. "addConversationTags"
    @Body : { _id : string; tag : string; conversationLog : any }

42. "deleteConversationTag"
    @Body : { _id : string; index : string/number; tag : string; sessionid : string;  }

43. "botTransferToAgent"
    @Body : { sessionid : string;  }

44. "endChat"
    @Body : { sid : string; survey? : any; }

45. "submitSurveyAfterEndChat"
    @Body : { feedbackForm : any; survey : any; }