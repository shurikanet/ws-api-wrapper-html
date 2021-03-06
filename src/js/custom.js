

$( document ).ajaxStart(function() {
    $(".loader").fadeIn();
});

$( document ).ajaxComplete(function() {
    $(".loader").fadeOut();
});

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
        theme: 'bootstrap4',
        allowClear: true,
        selectOnClose: true
    });

    if(currentPageIsSearch) {
        var currentMake = getQueryParam("make");
        makesSelect.val(currentMake).trigger("change.select2");
    }
});






makesSelect.on('change', function (e) {
    var makeSelected = this.value;

    yearsSelect.html("").prop("disabled", true);
    modelsSelect.html("").prop("disabled", true);
    trimsSelect.html("").prop("disabled", true);

    $(".data-block").addClass("invisible");
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
                placeholder: 'Years',
                allowClear: true,
                theme: 'bootstrap4',
                selectOnClose: true
            });
            yearsSelect.select2("open");
        });
    }

});



yearsSelect.on('change', function (e) {

    //var optionSelected = $(this).find("option:selected").text();
    var yearSelected = this.value;


    modelsSelect.html("").prop("disabled", true);
    trimsSelect.html("").prop("disabled", true);
    $(".data-block").addClass("invisible");
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
                theme: 'bootstrap4',
                allowClear: true
            });
            modelsSelect.select2("open");
        });
    }

});

modelsSelect.on('change', function (e) {

    //var modelsSelect = this.value;
    var modelSelected = modelsSelect.find("option:selected").val();
    $(".data-block").addClass("invisible");
    trimsSelect.html("").prop("disabled", true);
    //if trim is chosen
    if (modelSelected){

        trimsSelect.prop("disabled", false);

        $.ajax({
            type: 'GET',
            //url: '/api/ws-trims.http',
            url: 'https://api.wheel-size.com/v1/trims/?user_key='+apiKey,
            dataType: "json",
            data: {
                make: makesSelect.find("option:selected").val(),
                model: modelSelected,
                year: yearsSelect.find("option:selected").val()
            }

        }).then(function (data) {
            var dataObj = jQuery.parseJSON(JSON.stringify(data));
            var data = $.map(dataObj, function (obj) {
                obj.id = obj.id || obj.slug;
                obj.text = obj.text || obj.trim;
                obj.text = obj.text + ' ('+ obj.markets[0].abbr +')';
                //obj.text = obj.text || obj.name+' / '+obj.generation;
                return obj;
            });

            trimsSelect.prepend('<option selected>Choose Trims</option>').select2({
                data: dataObj,
                placeholder: 'Trims',
                theme: 'bootstrap4',
                allowClear: true,
                templateResult: formatState
            });
            trimsSelect.select2("open");
        });
    }

});

trimsSelect.on('change', function (e) {


    //if we use another page
    //window.location.href = "?search=Y&make="+makesSelect.find("option:selected").val()+"&model="+encodeURI(modelsSelect.find("option:selected").val())+"&year="+yearsSelect.find("option:selected").val()+"&trim="+encodeURI(trimsSelect.find("option:selected").val())+"&trimName="+encodeURI(trimsSelect.find("option:selected").text())+"&modelName="+encodeURI(modelsSelect.find("option:selected").text());


    var trimSelected = trimsSelect.find("option:selected").val();


    //trimsSelect.html("").prop("disabled", true);

    //if trim is chosen
    if (trimSelected){

        trimsSelect.prop("disabled", false);

        $.ajax({
            type: 'GET',
            //url: '/api/ws-data.http',
            url: 'https://api.wheel-size.com/v1/search/by_model/?user_key='+apiKey,
            dataType: "json",
            data: {
                make: makesSelect.find("option:selected").val(),
                //make: "mitsubishi",
                model: modelsSelect.find("option:selected").val(),
                //model: "outlander",
                year: yearsSelect.find("option:selected").val(),
                //year: "2015",
                trim: trimSelected
                //trim: "2.0i"
            }

        }).then(function (data) {

            //alert();

            // we consider that the only one element is in array
            // but let`s think about situation when we have 2+ for any case

            var wheelsArray = $.map(data, function(value, index) {
                return [value];
            });

            jPut.trims.data = wheelsArray;

            var i;
            for (i = 0; i < wheelsArray.length; i++) {

                var wheelsAr = wheelsArray[i].wheels;

                //array of OEM Wheel Pairs
                var oemWheels = wheelsAr.filter(function (el) {
                    return (el.is_stock === true);
                });

                //array of nonOEM Wheel Pairs
                var nonOemWheels = wheelsAr.filter(function (el) {
                    return (el.is_stock === false);
                });


                jPut.oemWheels.data = oemWheels;
                if (oemWheels.length > 0) {
                    $("#oemInsert-" + i).removeClass("invisible");
                    $("#oemInsert-" + i).append($(".oemDataWheels").html());
                }


                jPut.nonOemWheels.data = nonOemWheels;
                if (nonOemWheels.length > 0) {
                    $("#nonOemInsert-" + i).removeClass("invisible");
                    $("#nonOemInsert-" + i).append($(".nonOemDataWheels").html());
                 }

            }


            //header should be pre-filled:
            $("span[data-car-trim]").html(trimsSelect.find("option:selected").text());
            $("span[data-car-name]").html(yearsSelect.find("option:selected").text() + ' '+makesSelect.find("option:selected").text()+ ' '+ modelsSelect.find("option:selected").text());

            // show data what we get finally
            $(".data-block").removeClass("invisible");

            //remove temp elements
            $(".nonOemDataWheels, .oemDataWheels").html("");
        });
    }
});




//trimsSelect.trigger("change");  - for testing




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
    //   .trigger("change");
    var newOption = new Option(currentTrimName, currentTrimCode, true, true);
    trimsSelect.append(newOption).val(currentTrimCode);




}


