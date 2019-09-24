function checkParameterExists(parameter)
{
    //Get Query String from url
    fullQString = window.location.search.substring(1);

    paramCount = 0;
    queryStringComplete = "?";

    if(fullQString.length > 0)
    {
        //Split Query String into separate parameters
        paramArray = fullQString.split("&");

        //Loop through params, check if parameter exists.
        for (i=0;i<paramArray.length;i++)
        {
            currentParameter = paramArray[i].split("=");
            if(currentParameter[0] == parameter) //Parameter already exists in current url
            {
                return true;
            }
        }
    }

    return false;
}
function getQueryParam(name) {
    return (location.search.split(name + '=')[1] || '').split('&')[0];
}
function formatState (state) {
    console.log(state);
    if (!state.id) {
        return state.text;
    }

    var trimTextValue = state.text;
    if (state.trim)
        trimTextValue = state.trim;
    // for JDM market we often have body field filled out
    if (state.body)
        trimTextValue = trimTextValue + ' (' + state.body + ')';

    var $state = $(
        '<span>' + trimTextValue + '</span> '
    );

    if (state.generation)
        $state = $( '<div class="option--trim-name"><span class="option--trim-name-value">' + trimTextValue + '</span> '
        + '<span class="option--trim-generation">' + state.generation + ' ['+ state.production_start_year +' .. '+ state.production_end_year +']</span>'
        +'<span class="option--trim-market">' + state.markets[0].abbr +'</span>' +
            '</div>'
    );
    return $state;
};
