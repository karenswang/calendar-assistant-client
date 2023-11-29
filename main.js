// this chatbot frontend is bootstrapped from PandaWhoCodes's chatbot frontend: https://github.com/PandaWhoCodes/chatbot-frontend
// const axios = require('axios');
// require('dotenv').config();


/**
 * Returns the current datetime for the message creation.
 */
function getCurrentTimestamp() {
	return new Date();
}

/**
 * Renders a message on the chat screen based on the given arguments.
 * This is called from the `showUserMessage` and `showBotMessage`.
 */
function renderMessageToScreen(args) {
	// local variables
	let displayDate = (args.time || getCurrentTimestamp()).toLocaleString('en-IN', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	});
	let messagesContainer = $('.messages');

	// init element
	let message = $(`
	<li class="message ${args.message_side}">
		<div class="avatar"></div>
		<div class="text_wrapper">
			<div class="text">${args.text}</div>
			<div class="timestamp">${displayDate}</div>
		</div>
	</li>
	`);

	// add to parent
	messagesContainer.append(message);

	// animations
	setTimeout(function () {
		message.addClass('appeared');
	}, 0);
	messagesContainer.animate({ scrollTop: messagesContainer.prop('scrollHeight') }, 300);
}

/* Sends a message when the 'Enter' key is pressed.
 */
$(document).ready(function() {
    $('#msg_input').keydown(function(e) {
        // Check for 'Enter' key
        if (e.key === 'Enter') {
            // Prevent default behaviour of enter key
            e.preventDefault();
			// Trigger send button click event
            $('#send_button').click();
        }
    });
});

/**
 * Displays the user message on the chat screen. This is the right side message.
 */
function showUserMessage(message, datetime) {
	renderMessageToScreen({
		text: message,
		time: datetime,
		message_side: 'right',
	});
	const thread_id = localStorage.getItem('threadId');
	// submit message for run
	$.ajax({
		url: `https://api.openai.com/v1/threads/${thread_id}/runs`,
		type: 'POST',
		headers: {
            'Authorization': `Bearer ${localStorage.getItem('openAIKey')}`, // Ensure this key is not exposed in client-side code
            'Content-Type': 'application/json',
			'OpenAI-Beta': 'assistants=v1'
        },
        data: JSON.stringify({
            // assistant_id: localStorage.getItem('assistantId'),
			assistant_id: "asst_KlLg6WZIyzYln5MR7clGLHN1",}),
        success: function(response) {
            console.log(response);
			localStorage.setItem('runId', response.id);
			retrieveRunStatus(localStorage.getItem('threadId'), localStorage.getItem('runId'));
            // Handle success
        },
        error: function(error) {
            console.error(error);
            // Handle errors
        }
    });
}

/**
 * Displays the chatbot message on the chat screen. This is the left side message.
 */
function showBotMessage(message, datetime) {
	renderMessageToScreen({
		text: message,
		time: datetime,
		message_side: 'left',
	});
}

/**
 * Get input from user and show it on screen on button click.
 */
$('#send_button').on('click', function (e) {
	// get and show message and reset input
	let userInput = $('#msg_input').val();  // Store user input in a variable

	// save current message to thread
	$.ajax({
        url: `https://api.openai.com/v1/threads/${localStorage.getItem('threadId')}/messages`,
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('openAIKey')}`, // Ensure this key is not exposed in client-side code
            'Content-Type': 'application/json',
			'OpenAI-Beta': 'assistants=v1'
        },
        data: JSON.stringify({
            role: "user",
            content: userInput
        }),
        success: function(response) {
            console.log(response);
			showUserMessage(userInput);  // Display user message
			$('#msg_input').val('');     // Clear the input field
        },
        error: function(error) {
            console.error(error);
            // Handle errors
        }
    });
	

	// show bot message
	setTimeout(function () {
		showBotMessage("Working on it...");
		// run_id = localStorage.getItem('runId');
		// thread_id = localStorage.getItem('threadId');
		// retrieveRunStatus(thread_id, run_id);



		// $.ajax({
		// 	url: `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}/submit_tool_outputs`,
		// 	type: 'POST',
		// 	headers: {
		// 		'Authorization': `Bearer ${localStorage.getItem('openAIKey')}`, // Ensure this key is not exposed in client-side code
		// 		'Content-Type': 'application/json',
		// 		'OpenAI-Beta': 'assistants=v1'
		// 	},
		// 	data: JSON.stringify({
		// 		assistant_id: localStorage.getItem('assistantId'),
		// 	}),
		// 	success: function(response) {
		// 		console.log(response);
		// 		// Handle success
		// 	},
		// 	error: function(error) {
		// 		console.error(error);
		// 		// Handle errors
		// 	}
		// });
	}, 300);
});

/**
 * Returns a random string. Just to specify bot message to the user.
 */
function randomstring(length = 20) {
	let output = '';

	// magic function
	var randomchar = function () {
		var n = Math.floor(Math.random() * 62);
		if (n < 10) return n;
		if (n < 36) return String.fromCharCode(n + 55);
		return String.fromCharCode(n + 61);
	};

	while (output.length < length) output += randomchar();
	return output;
}

/**
 * Set initial bot message to the screen for the user.
 */
$(window).on('load', function () {
	showBotMessage('Hello there! To better assist you, please log in first.');
	// assistant().catch(console.error);
    // thread().catch(console.error);
});

function retrieveRunStatus(thread_id, run_id) {
    let intervalId = setInterval(() => {
        $.ajax({
            url: `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('openAIKey')}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v1'
            },
            success: function(response) {
                console.log(response);
                if (response.status === "completed") {
                    clearInterval(intervalId); // Stop checking
					getResponse(thread_id);
					showBotMessage("Sending request to server...");
					var botMessageString = localStorage.getItem('botMessage');
					// Replace curly quotes (and any other non-standard quotes) with standard quotes
					var botMessageString = botMessageString.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');

					// Now try parsing
					try {
						var botMessage = JSON.parse(botMessageString);
						// Proceed with using botMessage
					} catch (e) {
						console.error('Error parsing JSON:', e);
						// Handle parsing error
					}
					console.log('Stored botMessage:', typeof (localStorage.getItem('botMessage')));
					console.log('After parsing:', typeof (JSON.parse(localStorage.getItem('botMessage'))));
					// var botMessageString = localStorage.getItem('botMessage');

					// // Check if it's a string and not an object
					// if (typeof botMessageString === 'string') {
					// 	var botMessage = JSON.parse(botMessageString);
					// } else {
					// 	console.error('botMessageString is not a string:', botMessageString);
					// }

					// call our own API
					if (localStorage.getItem('endPointChoice') == "trackEvent") {
						$.ajax({
							url: 'http://localhost:3000/track',
							type: 'GET',
							contentType: 'application/json',
							data: botMessage,
							success: function(response) {
								var response = JSON.parse(response);
								showBotMessage(response);
								console.log(response)
								console.log("track endpoint called");
							},
							error: function(xhr, status, error) {
								console.error("Error in calling track endpoint: ", status, error);
							}
						});
					} else if (localStorage.getItem('endPointChoice') == "manageEvent") {
						$.ajax({
							url: 'http://localhost:3000/manage',
							type: 'POST',
							contentType: 'application/json',
							data: JSON.stringify(botMessage),
							success: function(response) {
								var response = JSON.parse(response);
								showBotMessage(response);
								console.log(response)
								console.log("manage endpoint called");
							},
							error: function(xhr, status, error) {
								console.error("Error in calling manage endpoint: ", status, error);
							}
						});
					}
					// add other endpoints	
                } else if (response.status === "requires_action") {
                    // clearInterval(intervalId); // Stop checking
					const tool_call_id = response.required_action.submit_tool_outputs.tool_calls[0].id;
					var function_called = response.required_action.submit_tool_outputs.tool_calls[0].function.name;
					localStorage.setItem('endPointChoice', function_called);
                    provideOutput(thread_id, run_id, tool_call_id); // Call provideOutput function
                }
                // If status is "queued", do nothing and the interval will make the request again
            },
            error: function(error) {
                console.error(error);
                clearInterval(intervalId); // Stop checking on error
                // Handle errors
            }
        });
    }, 5000); // Repeat every 5 seconds
}


function provideOutput(thread_id, run_id, tool_call_id) {
    $.ajax({
        url: `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}/submit_tool_outputs`,
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('openAIKey')}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
        },
        data: JSON.stringify({
            tool_outputs: [
                {
                    tool_call_id: tool_call_id,
					output: " "
				}
            ]
        }),
        success: function(response) {
            console.log(response);
			console.log("output submitted");
            // Handle success
        },
        error: function(error) {
            console.error(error);
            // Handle errors
        }
    });
}

function getResponse(thread_id) {
    $.ajax({
        url: `https://api.openai.com/v1/threads/${thread_id}/messages`,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('openAIKey')}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
        },
		// add query parameters
		data: {
			limit: 1,
			order: "desc"
		},
        success: function(response) {
			localStorage.setItem('botMessage', JSON.stringify(response.data[0].content[0].text.value));
			console.log("latest message retrieved: ", response.data[0].content[0].text.value);
			// Handle success
        },
        error: function(error) {
            console.error(error);
            // Handle errors
        }
    });
}