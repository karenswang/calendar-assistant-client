$('#login_button').on('click', function() {
    var email = $('#email').val();
    var clientId = $('#clientId').val();
    var clientSecret = $('#clientSecret').val();
    var openAIKey = $('#openAIKey').val();

    var data = {
        orgId: 1,
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
});
