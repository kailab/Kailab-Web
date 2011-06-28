<!DOCTYPE html>
<html>
    <head>
        <style>
body {
    text-align: center;
    background-color: #F5F7E1;
    background-image: url(bg.png);
    font-family: 'Arimo', Arial, sans-serif;
    color: #9b9b9b;
    margin: 0;
    padding: 0;
}

a {
    color: #BDCA0E;
}

h1 {
    margin: 0;
}

.subtitle {
    color: #BDCA0E;
    font-size: small;
}

#head {
    background-color: #FFFFFF;
    padding: 10px;
}

#head_wrapper {
    background-image: url(gradient_down.png);
    background-repeat: repeat-x;
    background-position: bottom;
    padding-bottom: 10px;
}

#main {
    margin: 40px auto;
    width: 900px;
}

.message {
    font-size: 200%;
}

.mail {
    display: block;
    margin: 20px;
}

div#image{
    z-index: 1;
    position: relative;
    width: 600px;
    height: 400px;
    margin: 0 auto 20px auto;
    overflow: hidden;
}
img#image_sky {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
}
img#image_sun {
    position: absolute;
    z-index: 2;
    top: 150px;
    left: 50px;
}
img#image_hill {
    position: absolute;
    z-index: 3;
    top: 200px;
    left: -50px;
}
img#image_witch {
    position: absolute;
    z-index: 4;
    bottom: 50px;
    left: 150px;
}
img#image_phone {
    position: absolute;
    z-index: 5;
    bottom: 20px;
    left: 300px;
}
        </style>

        <title>Kailab - coming soon</title>

        <script src="jquery.js" type="text/javascript"></script>
        <script src="plax.js" type="text/javascript"></script>
        <script src="typeface.js" type="text/javascript"></script>
        <script src="arimo_regular.typeface.js" type="text/javascript"></script>
        <script type="text/javascript">

$(document).ready(function(){
    var addr = 'contact'+'@'+'kailab.com';
    $('a.mail').text(addr).attr('href','mailto:'+addr);

    // parallax

    $('#image_sun').plaxify({"xRange":50,"yRange":50,"invert":true})
    $('#image_hill').plaxify({"xRange":20,"yRange":20})
    $('#image_witch').plaxify({"xRange":12,"yRange":12})
    $('#image_phone').plaxify({"xRange":10,"yRange":10})
    $.plax.enable();

});

        </script>
    </head>
    <body>
        <div id="head_wrapper">
            <div id="head">
                <h1><img src="logo.png" alt="Kailab"/></h1>
                <div class="subtitle">factory of games and dreams</div>
            </div>
        </div>

        <div id="main">
            <div id="image">
                <img id="image_witch" src="witch.png"/>
                <img id="image_phone" src="iphone.png"/>
                <img id="image_hill" src="img_fg.png"/>
                <img id="image_sky" src="img_bg.png"/>
                <img id="image_sun"  src="img_sun.png"/>
            </div>
            <div class="message typeface-js">New website coming soon!</div>
            <a class="mail typeface-js"></a>
        </div>
    </body>
</html>
