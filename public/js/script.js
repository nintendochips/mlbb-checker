// Initialize Lucide icons
lucide.createIcons();

// ===== FADE IN ANIMATIONS =====
setTimeout(function() {
  $('#header').addClass('active');
  setTimeout(function() {
    $('#card-container').addClass('active');
  }, 120);
}, 150);

// ===== FORM SUBMISSION =====
$('#validation-form').on('submit', function(e) {
  e.preventDefault();

  const gameId = $('#gameId').val();
  const serverId = $('#serverId').val();

  if (!gameId || !serverId) {
    showError('Please enter User ID and Server ID');
    return;
  }

  // Show loading state
  const originalButtonText = $('#submit-button').html();
  $('#submit-button').html('<i data-lucide="loader-2" class="icon-sm spinner"></i><span>Checking...</span>');
  $('#submit-button').prop('disabled', true);
  lucide.createIcons();

  // Hide previous results/errors
  $('#error-container').addClass('hidden');
  $('#result-container').addClass('hidden');

  // Make AJAX call
  $.ajax({
    url: '/api/validasi',
    type: 'GET',
    data: {
      id: gameId,
      serverid: serverId
    },
    dataType: 'json',
    success: function(data) {
      if (data.status === 'success') {
        showResult(data.result);
      } else {
        showError(data.message || 'Failed to validate ID');
      }
    },
    error: function(xhr) {
      let errorMessage = 'Failed to connect to server';
      try {
        const response = JSON.parse(xhr.responseText);
        if (response && response.message) {
          errorMessage = response.message;
        }
      } catch (e) {}
      showError(errorMessage);
    },
    complete: function() {
      $('#submit-button').html(originalButtonText);
      $('#submit-button').prop('disabled', false);
      lucide.createIcons();
    }
  });
});

function showError(message) {
  $('#error-message').text(message);
  $('#error-container').removeClass('hidden');

  $('#error-container').css({ opacity: 0, transform: 'translateY(6px)' });
  setTimeout(function() {
    $('#error-container').css({ opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease' });
  }, 10);
}

function showResult(result) {
  $('#result-nickname').text(result.nickname);
  $('#result-country').text(result.country);
  $('#result-container').removeClass('hidden');
  lucide.createIcons();

  $('#result-container').css({ opacity: 0, transform: 'translateY(6px)' });
  setTimeout(function() {
    $('#result-container').css({ opacity: 1, transform: 'translateY(0)', transition: 'all 0.3s ease' });
  }, 10);
}
