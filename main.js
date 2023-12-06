// this chatbot frontend is bootstrapped from PandaWhoCodes's chatbot frontend: https://github.com/PandaWhoCodes/chatbot-frontend

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
}

/**
 * Displays the chatbot message on the chat screen. This is the left side message.
 */
function showBotMessage(message, datetime) {
    // Convert the message to a JSON string, if it's an object
    if (typeof message === 'object') {
        message = JSON.stringify(message, null, 2); // Indent with 2 spaces for readability
    }
	message = linkify(message);

    renderMessageToScreen({
        text: `<pre>${message}</pre>`, // Wrap the message in a <pre> tag to preserve formatting
        time: datetime,
        message_side: 'left',
    });
}

/**
 * Get input from user and show it on screen on button click.
 */
$('#send_button').on('click', function (e) {
	// get and show message and reset input
	let userMessage = $('#msg_input').val();
	var apiKey = localStorage.getItem('openAIKey');
	var email = localStorage.getItem('email');

	let isExploreMode = $('#toggleExplore').is(':checked'); // Check if the toggle is checked

    // Decide which endpoint to call based on the toggle state
    let url = isExploreMode ? 'http://127.0.0.1:5000/get_explore_response' : 'http://127.0.0.1:5000/get_response';

	showUserMessage(userMessage);
	// get_response
	$.ajax({
        url: url,  // Flask endpoint URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ message: userMessage, api_key: apiKey, email: email }),
        success: function(response) {
            showBotMessage(response.response);  // Display the bot's response
        },
        error: function(error) {
            console.error('Error:', error);
            showBotMessage('Sorry, there was an error processing your request.');
        }
    });

	$('#msg_input').val('');

	// show bot message
	setTimeout(function () {
		showBotMessage("Working on it...");
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
});

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-_.])+@[a-zA-Z0-9\-_.]+\.[a-zA-Z]{2,5})/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}
