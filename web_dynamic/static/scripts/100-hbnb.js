$(document).ready(function () {
    // Check API status
    $.get("http://0.0.0.0:5001/api/v1/status/", function (data) {
        if (data.status === "OK") {
            $("#api_status").addClass("available");
        } else {
            $("#api_status").removeClass("available");
        }
    });

    // Store selected amenities, states, and cities
    let selectedAmenities = {};
    let selectedStates = {};
    let selectedCities = {};

    $('.amenities input[type="checkbox"]').change(function () {
        if (this.checked) {
            selectedAmenities[$(this).data('id')] = $(this).data('name');
        } else {
            delete selectedAmenities[$(this).data('id')];
        }
        $('.amenities h4').text(Object.values(selectedAmenities).join(', '));
    });

    $('.locations input[type="checkbox"]').change(function () {
        if (this.checked) {
            if ($(this).closest('ul').prev('input').length > 0) {
                selectedCities[$(this).data('id')] = $(this).data('name');
            } else {
                selectedStates[$(this).data('id')] = $(this).data('name');
            }
        } else {
            if ($(this).closest('ul').prev('input').length > 0) {
                delete selectedCities[$(this).data('id')];
            } else {
                delete selectedStates[$(this).data('id')];
            }
        }
        $('.locations h4').text(Object.values(selectedStates).concat(Object.values(selectedCities)).join(', '));
    });

    // Fetch places based on selected amenities, states, and cities
    function fetchPlaces(amenities = {}, states = {}, cities = {}) {
        $.ajax({
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ amenities: Object.keys(amenities), states: Object.keys(states), cities: Object.keys(cities) }),
            success: function (data) {
                $('.places').empty();
                data.forEach(place => {
                    let article = `<article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="description">${place.description}</div>
                    </article>`;
                    $('.places').append(article);
                });
            }
        });
    }

    // Initial fetch of all places
    fetchPlaces();

    // Fetch places based on filters when the Search button is clicked
    $('button').click(function () {
        fetchPlaces(selectedAmenities, selectedStates, selectedCities);
    });
});

