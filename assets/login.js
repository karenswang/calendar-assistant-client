$(document).ready(function() {
    $('#login_button').on('click', function() {
        // Collect data from the form
        var email = $('#email').val();
        var clientId = $('#clientId').val();
        var clientSecret = $('#clientSecret').val();
        var openAIKey = $('#openAIKey').val();

        // Prepare the request body
        var data = {
            email: email,
            clientId: clientId,
            clientSecret: clientSecret,
            openAIKey: openAIKey
        };

        // Make AJAX request to the /authenticate endpoint
        $.ajax({
            url: 'http://localhost:3000/authenticate',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                // Handle success (you can store tokens or any response as needed)
                console.log("Login successful: ", response);
            },
            error: function(xhr, status, error) {
                // Handle errors
                console.error("Error in login: ", status, error);
            }
        });
    });
});
