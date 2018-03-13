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


var currentPageIsSearch = checkParameterExists("search") ? true : false;
console.log(currentPageIsSearch);

//add your API here
var apiKey = "c88589c43ff3291fa3010a00a73ae133";

var makesSelect = $('.js-select2-makes');
var yearsSelect = $('.js-select2-years');
var modelsSelect = $('.js-select2-models');
var trimsSelect = $('.js-select2-trims');

//get list of makes.
//it is better to cache the results of this method
$.ajax({
    type: 'GET',
    url: '/api/ws-makes.http',  //cache!!!
    //url: 'https://api.wheel-size.com/v1/makes/?user_key='+apiKey,
    dataType: "json"
}).then(function (data) {
    //var dataObj = jQuery.parseJSON(data);
    var dataObj = jQuery.parseJSON(JSON.stringify(data));
    var data = $.map(dataObj, function (obj) {
        obj.id = obj.id || obj.slug;
        obj.text = obj.text || obj.name;
        return obj;
    });

    makesSelect.select2({
        data: dataObj,
        placeholder: 'Make',
        theme: 'bootstrap4'
    });

    if(currentPageIsSearch) {
        var currentMake = getQueryParam("make");
        makesSelect.val(currentMake).trigger("change.select2");
    }
});






makesSelect.on('change', function (e) {
    var makeSelected = this.value;
    console.log(makeSelected);
    yearsSelect.html("").prop("disabled", true);
    modelsSelect.html("").prop("disabled", true);
    trimsSelect.html("").prop("disabled", true);

    //if make is chosen
    if (makeSelected){
        yearsSelect.prop("disabled", false);

        $.ajax({
            type: 'GET',
            //url: '/api/ws-years.http',
            url: 'https://api.wheel-size.com/v1/years/?user_key='+apiKey,
            dataType: "json",
            data: { make: makeSelected }

        }).then(function (data) {
            var dataObj = jQuery.parseJSON(JSON.stringify(data));
            var data = $.map(dataObj, function (obj) {
                obj.id = obj.id || obj.slug;
                obj.text = obj.text || obj.name;
                return obj;
            });
            yearsSelect.prepend('<option selected>Year</option>').select2({
                data: dataObj,
                placeholder: {
                    id: "0",
                    text: "Select an Title" //Should be text not placeholder
                }
                ,
                allowClear: true,
                theme: 'bootstrap4'
            });
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
            //url: '/api/ws-models.http',
            url: 'https://api.wheel-size.com/v1/models/?user_key='+apiKey,
            dataType: "json",
            data: {
                make: makesSelect.find("option:selected").val(),
                year: yearSelected
            }

        }).then(function (data) {
            var dataObj = jQuery.parseJSON(JSON.stringify(data));
            var data = $.map(dataObj, function (obj) {
                obj.id = obj.id || obj.slug;
                obj.text = obj.text || obj.name;
                return obj;
            });

            modelsSelect.prepend('<option selected>Models</option>').select2({
                data: dataObj,
                placeholder: 'Models',
                theme: 'bootstrap4'
            });
        });
    }

});

modelsSelect.on('change', function (e) {

    var modelsSelect = this.value;

    trimsSelect.html("").prop("disabled", true);
    //if trim is chosen
    if (modelsSelect){

        trimsSelect.prop("disabled", false);

        $.ajax({
            type: 'GET',
            //url: '/api/ws-trims.http',
            url: 'https://api.wheel-size.com/v1/trims/?user_key='+apiKey,
            dataType: "json",
            data: {
                make: makesSelect.find("option:selected").val(),
                model: modelsSelect,
                year: yearsSelect.find("option:selected").val()
            }

        }).then(function (data) {
            var dataObj = jQuery.parseJSON(JSON.stringify(data));
            var data = $.map(dataObj, function (obj) {
                obj.id = obj.id || obj.slug;
                obj.text = obj.text || obj.name+' / '+obj.generation;
                return obj;
            });

            trimsSelect.prepend('<option selected>Trims</option>').select2({
                data: dataObj,
                placeholder: 'Trims',
                theme: 'bootstrap4'
            });


        });
    }

});

trimsSelect.on('change', function (e) {
    //show block with data
    $(".data-block").removeClass("invisible");

    //or create a query with GET param
   window.location.href = "?search=Y&make="+makesSelect.find("option:selected").val()+"&model="+encodeURI(modelsSelect.find("option:selected").val())+"&year="+yearsSelect.find("option:selected").val()+"&trim="+encodeURI(trimsSelect.find("option:selected").val())+"&trimName="+encodeURI(trimsSelect.find("option:selected").text())+"&modelName="+encodeURI(modelsSelect.find("option:selected").text());
   //console.log("/?make="+makesSelect.find("option:selected").val()+"&model="+modelsSelect.find("option:selected").val()+"&year="+yearsSelect.find("option:selected").val()+"&trim="+makesSelect.find("option:selected").val());

});

//if GET "search" param exists
if(currentPageIsSearch) {

    //show block with data
    $(".data-block").removeClass("invisible");

    var currentMake = getQueryParam("make");
    makesSelect.val(currentMake).trigger("change.select2");


    var currentYear = getQueryParam("year");
    var currentModelCode = decodeURI(getQueryParam("model"));
    var currentModelName = decodeURI(getQueryParam("modelName"));
    var currentTrimCode = decodeURI(getQueryParam("trim"));
    var currentTrimName = decodeURI(getQueryParam("trimName"));

    // Create a DOM Option and pre-select by default

    //makesSelect.val(currentMake).trigger("change");
    var newOption = new Option(currentYear, currentYear, true, true);
    yearsSelect.append(newOption).val(currentYear);
    var newOption = new Option(currentModelName, currentModelCode, true, true);
    modelsSelect.append(newOption).val(currentModelCode);
    var newOption = new Option(currentTrimName, currentTrimCode, true, true);
    trimsSelect.append(newOption).val(currentTrimCode);


}


