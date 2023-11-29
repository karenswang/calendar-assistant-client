$('#login_button').on('click', function() {
    var email = $('#email').val();
    var clientId = $('#clientId').val();
    var clientSecret = $('#clientSecret').val();
    var openAIKey = $('#openAIKey').val();

    var data = {
        email: email,
        clientId: clientId,
        clientSecret: clientSecret,
        openAIKey: openAIKey
    };
    localStorage.setItem('openAIKey', openAIKey);
    localStorage.setItem('email', email);
    $.ajax({
        url: 'http://localhost:3000/authenticate',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            var userEmail = $('#email').val(); // Get the user's email from input field
            $('.login-panel-body').html('<p>Logged in: ' + userEmail + '</p>'); // Replace HTML
            console.log("OAuth flow initiated");
        },
        error: function(xhr, status, error) {
            console.error("Error in initiating authentication: ", status, error);
        }
    });
    
    // // create a new openai assistant
    // $.ajax({
    //     url: 'https://api.openai.com/v1/assistants',
    //     type: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${openAIKey}`, // Ensure this key is not exposed in client-side code
    //         'Content-Type': 'application/json',
    //         'OpenAI-Beta': 'assistants=v1'
    //     },
    //     data: JSON.stringify({
    //         instructions: "You are a natural-language-to-json converter. The user will request to track, manage (update, delete, create) calendar events using natural language. You will first determine what type of request the user is asking, then based on the type, extract all the required parameters as well as an optional parameters from the user input to form a json object as the result. The final result will be well-formatted json ready to be passed to an API.",
    //         name: "Calender Assistant",
    //         tools: [{
    //             "type": "function",
    //             "function": {
    //                 "name": "trackEvent",
    //                 "description": "If user asks to retrieve events on the calendar, extract email and an optional parameter from the message and return structured json response, e.g. {\"email\": \"user email\", \"scope\": \"scope\"}.",
    //                 "parameters": {
    //                   "type": "object",
    //                   "properties": {
    //                     "email": {
    //                       "type": "string",
    //                       "description": "This can be found from previous messages"
    //                     },
    //                     "scope": {
    //                       "type": "integer",
    //                       "description": "This is the time frame the user wants to track the events for. It's an integer between 0 and 30."
    //                     }
    //                   },
    //                   "required": [
    //                     "email"
    //                   ]
    //                 }
    //               }
    //           }, {
    //             "type": "function",
    //             "function": {
    //                 "name": "manageEvent",
    //                 "description": "If user asks to manage events on the calendar, extract email, type (insert, update, delete), startTime, endTime, timezone from the message and return structured json response: {\"email\": \"user email\", \"type\": \"type\", \"startTime\": \"startTime\", \"endTime\": \"endTime\", \"timezone\": \"timezone\"}. Refer to the files to validate and format your response",
    //                 "parameters": {
    //                   "type": "object",
    //                   "properties": {
    //                     "email": {
    //                       "type": "string",
    //                       "description": "This can be found from previous messages"
    //                     },
    //                     "type": {
    //                       "type": "string",
    //                       "description": "This can be insert, update, or delete, based on the user's specific request"
    //                     },
    //                     "startTime": {
    //                       "type": "string",
    //                       "description": "infer this based on user's request. Only datetime is accepted."
    //                     },
    //                     "endTime": {
    //                       "type": "string",
    //                       "description": "infer this based on user's request. Only datetime is accepted."
    //                     },
    //                     "timezone": {
    //                       "type": "string",
    //                       "description": "infer this based on user's request. Default to 'America/New_York'."
    //                     }
    //                   },
    //                   "required": [
    //                     "email",
    //                     "type",
    //                     "startTime",
    //                     "endTime",
    //                     "timezone"
    //                   ]
    //                 }
    //               }
    //           }],
    //         model: "gpt-3.5-turbo"
    //     }),
    //     success: function(response) {
    //         console.log(response);
    //         localStorage.setItem('assistantId', response.id);
    //         // Handle success
    //     },
    //     error: function(error) {
    //         console.error(error);
    //         // Handle errors
    //     }
    // });

    // create a new thread
    $.ajax({
        url: 'https://api.openai.com/v1/threads',
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('openAIKey')}`, // Ensure this key is not exposed in client-side code
            'Content-Type': 'application/json',
			'OpenAI-Beta': 'assistants=v1'
        },        
        data: JSON.stringify({
            messages: [
                {
                    role: "user",
                    content: `user email: ${email}`
                }
            ]
        }),
        success: function(response) {
            console.log(response);
            console.log("id:", response.id);
			localStorage.setItem('threadId', response.id);
            // Handle success
        },
        error: function(error) {
            console.error(error);
            // Handle errors
        }
    });
});
