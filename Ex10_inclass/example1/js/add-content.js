var greeting;
var today= new Date();
var hour = today.getHours;
var greeting;

if (hourNow >18)
{
    greeting = 'Good Evening';
}
else if( hourNow > 12)
{
    greeting = 'Good Afternoon';
}

else{
    greeting = 'Welcome';
}

document.write('<h3>' + greeting + '</h3>');