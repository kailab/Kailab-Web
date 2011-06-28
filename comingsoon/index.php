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

#message {
    font-size: 200%;
    width: 100%;
    padding: 10px;
    position: absolute;
    top: 100px;
    text-align: left;
}

#mail {
    display: block;
    position: absolute;
    width: 100%;
    top: 150px;
    left: 0;
    text-align: left;
    z-index: 2;
    background: #FFFFFF;
    padding: 10px;
    background-color: #F5F7E1;
    background-image: url(bg.png);
}

#image{
    background-image: url(img_bg.png);
    z-index: 1;
    position: relative;
    width: 620px;
    height: 400px;
    margin: 0 auto 20px auto;
    padding: 0;
    overflow: hidden;
/*    border: 1px solid #BDCA0E; */
}

#image_clouds {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    width: 1590px;
    text-align: left;
}

#image_ground {
    position: absolute;
    top: 300px;
    left: -30px;
}

#image_phone {
    position: absolute;
    top: 80px;
    left: 430px;
    z-index: 2;
}
        </style>

        <title>Kailab - coming soon</title>
        <script src="jquery.js" type="text/javascript"></script>
        <script src="plax.js" type="text/javascript"></script>
        <script src="typeface.js" type="text/javascript"></script>
        <script src="arimo_regular.typeface.js" type="text/javascript"></script>
        <script type="text/javascript">

$(document).ready(function(){

    // email address
    var addr = 'contact'+'@'+'kailab.com';
    $('a#mail').text(addr).attr('href','mailto:'+addr);

    // animate clouds
    var animate_clouds = function(){
        $(this).animate({
            left: "-=790"
        },30000,'linear',function(){
            $(this).css('left',0);
            animate_clouds.call(this);
        });
    };
    animate_clouds.call($('#image_clouds'));

    $('#image_ground').plaxify({"xRange":10,"yRange":10})
    $('#image_phone').plaxify({"xRange":20,"yRange":20})
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

                <div id="message" class="typeface-js">New website coming soon!</div>
                <a id="mail"></a>

                <div id="image_clouds">
                    <img src="clouds.png"/>
                    <img src="clouds.png"/>
                </div>
                <img id="image_ground" src="ground.png" />
                <img id="image_phone" src="phone.png" />
            </div>
		

        </div>

        <div id="bottom">

        </div>
    </body>
</html>
