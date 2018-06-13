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

    var $state = $(
        '<span>' + state.text + '</span> '
    );
    if (state.generation)
        $state = $( '<span style="position:relative; display:block;"><span>' + state.text + '</span> '
        + '<span style="position: absolute; top: -13px; color: #777;  font-size:12px;white-space: nowrap;right: 10px;">Gen: ' + state.generation + '</span></span>'
    );
    return $state;
};
