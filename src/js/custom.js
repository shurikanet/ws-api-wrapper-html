/*
$('.js-select2-makes').select2({
    //placeholder: 'Select an option'
    //minimumResultsForSearch: 20,
    //maximumInputLength: 20,
    ajax: {
        url: '/api/ws-makes.http',
        dataType: 'json'
    }
});
*/


var makesSelect = $('.js-select2-makes');
var yearsSelect = $('.js-select2-years');
var modelsSelect = $('.js-select2-models');
var trimsSelect = $('.js-select2-trims');

//get list of makes.
//it is better to cache the results of this method
$.ajax({
    type: 'GET',
    //url: '/api/ws-makes.http'
    url: 'https://api.wheel-size.com/v1/makes/?user_key=c88589c43ff3291fa3010a00a73ae133'
}).then(function (data) {
    var dataObj = jQuery.parseJSON(JSON.stringify(data));
    //dataObj = JSON.parse(data);
    var data = $.map(dataObj, function (obj) {
        obj.id = obj.id || obj.slug;
        obj.text = obj.text || obj.name;
        return obj;
    });

    makesSelect.select2({
        data: dataObj,
        placeholder: 'Make',
        theme: 'bootstrap4'
    })
});






makesSelect.on('change', function (e) {
    //var optionSelected = $(this).find("option:selected").text();
    var makeSelected = this.value;
    yearsSelect.html("").prop("disabled", true);
    modelsSelect.html("").prop("disabled", true);
    trimsSelect.html("").prop("disabled", true);
    //if make is chosen
    if (makeSelected){
        yearsSelect.prop("disabled", false);

        $.ajax({
            type: 'GET',
            url: '/api/ws-years.http',
            data: function (makeSelected) {
                var query = {
                    make: makeSelected
                }
                return query;
            }
        }).then(function (data) {
            var dataObj = JSON.parse(data);
            var data = $.map(dataObj, function (obj) {
                obj.id = obj.id || obj.slug;
                obj.text = obj.text || obj.name;
                return obj;
            });
            yearsSelect.select2({
                data: dataObj,
                placeholder: 'Years',
                theme: 'bootstrap4'
            })
        });
    }

});

yearsSelect.on('change', function (e) {
    //var optionSelected = $(this).find("option:selected").text();
    var yearSelected = this.value;

    modelsSelect.html("").prop("disabled", true);
    trimsSelect.html("").prop("disabled", true);
    //if year is chosen
    if (yearSelected){

        modelsSelect.prop("disabled", false);

        $.ajax({
            type: 'GET',
            url: '/api/ws-models.http',
            data: function (yearSelected) {
                var query = {
                    make: makeSelected,
                    year: yearSelected
                }
                return query;
            }
        }).then(function (data) {
            var dataObj = JSON.parse(data);
            var data = $.map(dataObj, function (obj) {
                obj.id = obj.id || obj.slug;
                obj.text = obj.text || obj.name;
                return obj;
            });

            console.log(dataObj);

            modelsSelect.select2({
                data: dataObj,
                placeholder: 'Models',
                theme: 'bootstrap4'
            })
        });
    }

});

modelsSelect.on('change', function (e) {
    //var optionSelected = $(this).find("option:selected").text();
    var modelsSelect = this.value;

    trimsSelect.html("").prop("disabled", true);
    //if trim is chosen
    if (modelsSelect){

        trimsSelect.prop("disabled", false);

        $.ajax({
            type: 'GET',
            url: '/api/ws-trims.http',
            data: function (yearSelected) {
                var query = {
                    make: makeSelected,
                    year: yearSelected
                }
                return query;
            }
        }).then(function (data) {
            var dataObj = JSON.parse(data);
            var data = $.map(dataObj, function (obj) {
                obj.id = obj.id || obj.slug;
                obj.text = obj.text || obj.name+' / '+obj.generation;
                return obj;
            });

            trimsSelect.select2({
                data: dataObj,
                placeholder: 'Trims',
                theme: 'bootstrap4'
            })
        });
    }

});