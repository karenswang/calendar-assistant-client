// this is not currently used since we have created the assistant in UI
// but this is the code that would be used to create the assistant
   
    // create a new openai assistant
    $.ajax({
        url: 'https://api.openai.com/v1/assistants',
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${openAIKey}`, // Ensure this key is not exposed in client-side code
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
        },
        data: JSON.stringify({
            instructions: "You are a natural-language-to-json converter. The user will request to track, manage (update, delete, create) calendar events using natural language. You will first determine what type of request the user is asking, then based on the type, extract all the required parameters as well as an optional parameters from the user input to form a json object as the result. The final result will be well-formatted json ready to be passed to an API.",
            name: "Calender Assistant",
            tools: [{
                "type": "function",
                "function": {
                    "name": "trackEvent",
                    "description": "Sends a tracking event to a specified endpoint and returns the server's response. The function makes a GET request to the specified URL with the provided data.",
                    "parameters": {
                      "type": "object",
                      "properties": {
                        "email": {
                          "type": "string",
                          "description": "The email address associated with the event."
                        },
                        "scope": {
                          "type": "integer",
                          "description": "An integer representing the scope of the event, between 0 and 30."
                        },
                        "groupBy": {
                          "type": "string",
                          "enum": [
                            "event",
                            "eventType",
                            "color"
                          ],
                          "description": "A string to specify how the tracking data should be grouped."
                        },
                        "analysis": {
                          "type": "boolean",
                          "description": "A boolean flag to indicate whether analysis is required for the tracking event."
                        }
                      },
                      "required": [
                        "email",
                        "scope",
                        "analysis"
                      ]
                    }
                  }
              }, {
                "type": "function",
                "function": {
                    "name": "createEvent",
                    "description": "Creates an event by sending a POST request with event details to a specified endpoint.",
                    "parameters": {
                      "type": "object",
                      "properties": {
                        "email": {
                          "type": "string",
                          "description": "Email address associated with the event creation."
                        },
                        "startTime": {
                          "type": "string",
                          "description": "Start time of the event in ISO 8601 format."
                        },
                        "endTime": {
                          "type": "string",
                          "description": "End time of the event in ISO 8601 format."
                        },
                        "timezone": {
                          "type": "string",
                          "default": "America/New_York",
                          "description": "Timezone of the event. Default is 'America/New_York'."
                        },
                        "summary": {
                          "type": "string",
                          "description": "A brief summary or title of the event."
                        },
                        "description": {
                          "type": "string",
                          "description": "Detailed description of the event."
                        },
                        "location": {
                          "type": "string",
                          "description": "Physical location or address of the event."
                        }
                      },
                      "required": [
                        "email",
                        "startTime",
                        "endTime"
                      ]
                    }
                  },
              },
            {"type": "function",
            "function": {
                "name": "updateEvent",
                "description": "Updates an event by sending a POST request with event details to a specified endpoint.",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "email": {
                      "type": "string",
                      "description": "Email address associated with the event creation."
                    },
                    "startTime": {
                      "type": "string",
                      "description": "Start time of the event in ISO 8601 format."
                    },
                    "endTime": {
                      "type": "string",
                      "description": "End time of the event in ISO 8601 format."
                    },
                    "eventId": {
                      "type": "string",
                      "description": "ID of the event to be updated."
                    },
                    "timezone": {
                      "type": "string",
                      "default": "America/New_York",
                      "description": "Timezone of the event. Default is 'America/New_York'."
                    },
                    "summary": {
                      "type": "string",
                      "description": "A brief summary or title of the event."
                    },
                    "description": {
                      "type": "string",
                      "description": "Detailed description of the event."
                    },
                    "location": {
                      "type": "string",
                      "description": "Physical location or address of the event."
                    }
                  },
                  "required": [
                    "email",
                    "eventId"
                  ]
                }
              }},
              {"type": "function",
              "function": {
                "name": "deleteEvent",
                "description": "Deletes an event by sending a POST request with event details to a specified endpoint.",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "email": {
                      "type": "string",
                      "description": "Email address associated with the event creation."
                    },
                    "type": {
                      "type": "string",
                      "description": "Type of the event action, This value is always 'update' for this function."
                    },
                    "eventId": {
                      "type": "string",
                      "description": "ID of the event to be updated."
                    }
                  },
                  "required": [
                    "email",
                    "eventId"
                  ]
                }
              }},
              {"type": "function",
              "function": {
                "name": "getAnalytics",
                "description": "This is not associated with an invididual user or email. Do not reference any user email in the response. Returns aggregated analytics data for all the users for the current client organization using this service.",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "orgId": {
                      "type": "string",
                      "description": "ID of the client that's using this service. This value is always 1."
                    }
                  },
                  "required": [
                    "orgId"
                  ]
                }
              }}],
            //add more functions here,
            model: "gpt-3.5-turbo"
        }),
        success: function(response) {
            console.log(response);
            localStorage.setItem('assistantId', response.id);
            // Handle success
        },
        error: function(error) {
            console.error(error);
            // Handle errors
        }
    });
