var $window = $(window);
var actualNote = 1;
var notesIds;
var pwIds;
var key;

var arrayIcons = ['fui-arrow-left', 'fui-cmd', 'fui-check-inverted', 'fui-heart', 'fui-location', 'fui-plus', 'fui-check', 'fui-cross', 'fui-list', 'fui-new', 'fui-video', 'fui-photo', 'fui-volume', 'fui-time', 'fui-eye', 'fui-chat', 'fui-search', 'fui-user', 'fui-mail', 'fui-lock', 'fui-gear', 'fui-radio-unchecked', 'fui-radio-checked', 'fui-checkbox-unchecked', 'fui-checkbox-checked', 'fui-calendar-solid', 'fui-pause', 'fui-play', 'iconToSelect icon-tint', 'icon-move', 'icon-asterisk', 'icon-fire', 'icon-plane', 'icon-magnet', 'icon-shopping-cart', 'icon-wrench', 'icon-road', 'icon-trash', 'icon-user', 'icon-refresh', 'icon-headphones', 'icon-qrcode', 'icon-book', 'icon-leaf', 'icon-bell', 'icon-eye-close', 'icon-eye-open', 'icon-gift', 'icon-repeat', 'icon-glass', 'icon-tasks'];
var colorArray = ['2ECC71', '3498DB', '9B59B6', 'F1C40F', 'E67E22', 'E74C3C', '7F8C8D'];
var pwClicked = false;
var pwClickedId;

$('#ameliorer').css('height', $window.height() - 90);
$('#ameliorer').css('width', $window.width() - 330);
$('#noteTitle').css('width', $window.width() - 550);
$('.todoList').css('height', $window.height() + 0);

var offset = 300;
var ffoffset4 = 514;
var ffoffset3 = 455;

$('.rowPw').css('width', $window.width() - offset);
$('.rowPw').css('height', $window.height() - 0);

// Some FF Tweaks... >> TODO !
if ($.browser.mozilla) {
	if ($window.width() > 1135) $('.spanPw').css('width', (($window.width() - ffoffset4) / 4));
	else $('.spanPw').css('width', (($window.width() - ffoffset3) / 3));
	$('.spanPw').css('height', '110');
	$('#ameliorer').css('width', $window.width() - 292);
	$('#noteTitle').css({"padding-left": "60px","left": "285px"});
	$('#ameliorer').css({"left": "285px"});
	$('.rowPw').css({"left": "285px"});
	$('.rowPw').css('width', ($window.width() - 275));
	$('.titlePw').css({"overflow-y": "hidden"});
	$('#moarPw').css({"right": "18px"});
}


// Make PW Manager responsive
else {
	if ($window.width() > 1135) $('.spanPw').css('width', '25%');
	else {
        $('.spanPw').css('width', '33%');
        $('.spanPw:nth-child(3n+3)').css('width', '34%');
    }
}


// Resize callback
$(window).resize(function () {
	// Notes
	$('#ameliorer').css('height', $window.height() - 90);
	$('#ameliorer').css('width', $window.width() - 330);
	$('#noteTitle').css('width', $window.width() - 550);
	$('.todoList').css('height', $window.height() + 0);
	$('.rowPw').css('width', $window.width() - offset);
	$('.rowPw').css('height', $window.height() - 0);

	// Some FF Tweaks...
	if ($.browser.mozilla) {
		if ($window.width() > 1135) $('.spanPw').css('width', (($window.width() - ffoffset4) / 4));
		else $('.spanPw').css('width', (($window.width() - ffoffset3) / 3));
		$('#ameliorer').css('width', $window.width() - 292);
		$('#ameliorer').css('width', $window.width() - 292);
		$('.rowPw').css('width', ($window.width() - 275));
	}


	// Make PW Manager responsive
	else {
		if ($window.width() > 1135) $('.spanPw').css('width', '25%');
        else {
            $('.spanPw').css('width', '33%');
            $('.spanPw:nth-child(3n+3)').css('width', '34%');
        }
	}

	// Cross Color
	if (pwIds.length < 4 && $window.width() > 1135) $('#moarPw').css('color', '#34495e');
	else if (pwIds.length < 3 && $window.width() < 1135) $('#moarPw').css('color', '#34495e');
	else $('#moarPw').css('color', '#fff');
});


// Change PW function
function changePw() {

	// Empty stuff & logout
	$('.todo').html('');
	$('#noteTitle').val('');
	$('#ameliorer').html('');
	$('#login-pass').val('');
	$('#pwManager').html('');

	var pw = $("#changePw").val();

	if (!pw || pw.length === 0) return;

	// Set PW salt
	var saltArray = CryptoJS.lib.WordArray.random(128 / 8);
	var salt = saltArray.toString();
	$.jStorage.set("salt", salt);

	// PBKDF2
	var key512Bits1000Iterations = sjcl.misc.pbkdf2(pw, salt, 1000, (128 * 4), hmacSHA1);
	var longkey = sjcl.codec.hex.fromBits(key512Bits1000Iterations);

	// Save the beginning of the key, for the login
	var shortkey = longkey.substring(0, 64);
	$.jStorage.set("shortkey", shortkey);

	var newKey = longkey.substring(64, 128);

	// Change all notes content
	for (var i = 0, c = notesIds.length; i < c; i++) {

		// Get note Icon, title, timestamp
		var icon = getEncrypted(notesIds[i] + 'icon');
		var noteTime = getEncrypted(notesIds[i] + 'time');
		var noteTitle = getEncrypted(notesIds[i] + 'title');
		var note = getEncrypted(notesIds[i]);

		//setEncrypted(where, what, changePw)
		setEncrypted(notesIds[i] + 'icon', icon, newKey);
		setEncrypted(notesIds[i] + 'time', noteTime, newKey);
		setEncrypted(notesIds[i] + 'title', noteTitle, newKey);
		setEncrypted(notesIds[i], note, newKey);
	}

	// Change all pw content
	for (var i = 0, c = pwIds.length; i < c; i++) {

		// Get note Icon, title, timestamp
		var title = getEncrypted(pwIds[i]);
		var log = getEncrypted(pwIds[i] + 'log');
		var pw = getEncrypted(pwIds[i] + 'pw');
        var color = getEncrypted(pwIds[i] + 'color');


		//setEncrypted(where, what, changePw)
		setEncrypted(pwIds[i], title, newKey);
		setEncrypted(pwIds[i] + 'log', log, newKey);
		setEncrypted(pwIds[i] + 'pw', pw, newKey)
		setEncrypted(pwIds[i] + 'color', color, newKey)

	}

	// Change list
	setEncrypted("notesIds", notesIds, newKey);
	setEncrypted("pwIds", pwIds, newKey);
	setEncrypted("actualNote", actualNote, newKey);

	// Everything's change, change key now
	key = newKey;
	//console.log(key);

	loadNotes();
	loadPw();

	$('.changePw').fadeOut('fast');
}


// Login Function
function login() {

	// Get pw & salt
	var pw = $("#login-pass").val();
	var salt = $.jStorage.get("salt");

	// First start, password not set
	if (!salt) {

		// return if empty pw)
		if (!pw || pw.length === 0) return;

		// Set PW salt
		var saltArray = CryptoJS.lib.WordArray.random(128 / 8);
		var salt = saltArray.toString();
		$.jStorage.set("salt", salt);

		// PBKDF2
		var key512Bits1000Iterations = sjcl.misc.pbkdf2(pw, salt, 1000, (128 * 4), hmacSHA1);
		var longkey = sjcl.codec.hex.fromBits(key512Bits1000Iterations);

		// Save the beginning of the key, for the login
		var shortkey = longkey.substring(0, 64);
		$.jStorage.set("shortkey", shortkey);

		// And the rest of the key is the key for encryption
		key = longkey.substring(64, 128);
		console.log(key);

		// Load notes
		loadNotes();
		loadPw();

		// Fadeout the login div
		$('.login1').fadeToggle('fast');

		return;
	}


	// Generate key
	var key512Bits1000Iterations = sjcl.misc.pbkdf2(pw, salt, 1000, (128 * 4), hmacSHA1);
	var longkey = sjcl.codec.hex.fromBits(key512Bits1000Iterations);
	var shortkey = longkey.substring(0, 64);

	// Pw right...
	if (shortkey === $.jStorage.get("shortkey")) {

		// The key is the key for encryption
		key = longkey.substring(64, 128);
		console.log(key);

		// Load notes list & note content
		notesIds = getEncrypted("notesIds");
		pwIds = getEncrypted("pwIds");

		loadNotes();
		loadPw();

		// Fadeout the login div
		$('#login-pass').blur();
		$('.login1').fadeToggle('fast');
	}


	// Wrong password...
	else $('.wrong').html('<a class="login-link" href="#">Do, or do not. There is no try.</a>')
                    .delay(10000)
                    .queue(function (n) {
                           $('.wrong').html('<a class="login-link" href="#">You can reset the application in File > Reset Database</a>');
                           n();
                    });


}


// Jstorage + AES
function getEncrypted(element) {

	if (!key) return;
	var encrypted = $.jStorage.get(element);
	if (!encrypted) return;

	var decrypt = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);

	// Crypto.js is not happy with empty content
	if (decrypt == 'voidvoidvoidvoid') decrypt = '';
	if (element == 'notesIds' || element == 'pwIds') decrypt = decrypt.split(',');

	return decrypt;
}


function setEncrypted(where, what, changePw) {

	if (!key) return;
	if (where == 'notesIds' || where == 'pwIds') what = what.join();
	if (!what || what.length === 0) what = "voidvoidvoidvoid";

	if (changePw) var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(what), changePw).toString();
	else var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(what), key).toString();

	$.jStorage.set(where, encrypted);
}


// Load note function
function loadNotes(){

	if (!notesIds) firststart();

	// Get precedent note ID
	var precedentNote = getEncrypted('actualNote');

	// Check all items
	for (var i = 0, c = notesIds.length; i < c; i++) {

		// Get note Icon
		var icon = getEncrypted(notesIds[i] + 'icon');
		var noteTitle = getEncrypted(notesIds[i] + 'title');
		var noteTime = getEncrypted(notesIds[i] + 'time');

		// Last time checked
		if (notesIds[i] == precedentNote) var selected = 'class="todo-done"';
		else var selected = '';

        if (!noteTitle || noteTitle.length === 0 || noteTitle == ' ') noteTitle = 'New Note';

		var stringWithRandID = '<li  id=' + notesIds[i] + ' ' + selected + '><div class="todo-icon ' + icon + '"> </div> <div class="todo-content"> <h4 class="todo-name">' + noteTitle + '</h4><div class="under">'+ noteTime +'</div></div> </li>';

        $(".todo").append(stringWithRandID);

	}

	actualNote = precedentNote;

	// Load First element value & title
	var value = getEncrypted(actualNote);
    var valuetitle = getEncrypted(actualNote + 'title');
	var valueIcon = getEncrypted(actualNote + 'icon');

	$("#ameliorer").html(value);
	$("#noteTitle").val(valuetitle);

	// Load Icon
	$('#save').removeClass();
	$('#save').toggleClass(valueIcon);

	// Load enhanced textarea
	$('#ameliorer').wysiwyg();
    

    // PW Cross color
    if (pwIds.length < 4 && $window.width() > 1135) $('#moarPw').css('color', '#34495e');
    else if (pwIds.length < 3 && $window.width() < 1135) $('#moarPw').css('color', '#34495e');
    else $('#moarPw').css('color', '#fff');
    
	if (actualNote == 'password') {
		$('#toolbar').hide();
		$('#ameliorer').hide();
		$('.rowPw').show();
        $('#moarPw').show();

	} else {
		$('#ameliorer').show();
		$('#toolbar').show();
		$('.rowPw').hide();

	}
}


// Load Pw
function loadPw() {
	/***** PW Manager *****/

	// Check all items
	for (var i = 0, c = pwIds.length; i < c; i++) {

		var title = getEncrypted(pwIds[i]);
		var log = getEncrypted(pwIds[i] + 'log');
        var color = getEncrypted(pwIds[i] + 'color');
        
        if(color==null) color = '9B59B6';
        
		var stringWithRandID = '<div id="' + pwIds[i] + '" class="spanPw" style="background-color:#' + color + '; overflow:hidden;"> <h3><div class="titlePw" contenteditable="true">' + title + '</div></h3>  <div class="log" contenteditable="true">' + log + '</div>   <div  class="pw" style="" contenteditable="true">' + '##########' + '</div><i id="random" class="icon-random" style=""></i><i id="changeColor" original-title="Change Color" class="icon-repeat" style="" original-title="Random Password (Double Click)"></i><div id="deletePw" original-title="Delete Password (Double Click)" class="fui-cross"></div></div>';

		$("#pwManager").append(stringWithRandID);

	}

	if (pwIds.length < 4 && $window.width() > 1135) $('#moarPw').css('color', '#34495e');
	else if (pwIds.length < 3 && $window.width() < 1135) $('#moarPw').css('color', '#34495e');
	else $('#moarPw').css('color', '#fff');

	// Resize for greater goods
	if ($.browser.mozilla) {
		if ($window.width() > 1135) $('.spanPw').css('width', (($window.width() - ffoffset4) / 4));
		else $('.spanPw').css('width', (($window.width() - ffoffset3) / 3));
		$('.spanPw').css('height', '110');
	} else {
		if ($window.width() > 1135) $('.spanPw').css('width', '25%');
		else {
            $('.spanPw').css('width', '33%');
            $('.spanPw:nth-child(3n+3)').css('width', '34%');
        }
	}

}


// Necessary for the salt generation
var hmacSHA1 = function (key) {
	var hasher = new sjcl.misc.hmac(key, sjcl.hash.sha1);
	this.encrypt = function () {
		return hasher.encrypt.apply(hasher, arguments);
	};
};


// First start
function firststart() {

	notesIds = new Array();
	pwIds = new Array();

	/*** Set 1st tab, pw manager ***/
	var nb = 0;
	notesIds[nb] = 'password';
	var noteIcon = notesIds[nb] + "icon";
	setEncrypted(noteIcon, 'fui-lock');
	setEncrypted(notesIds[nb] + "title", "Password");
	setEncrypted(notesIds[nb] + "time", "Safe Password Manager");

	// pwIds
	nb = pwIds.length;
	var randomizedId = makeid();
	setEncrypted(randomizedId, "aBay");
	setEncrypted(randomizedId + "log", "awesomeSeller");
    setEncrypted(randomizedId + "color", '9B59B6');
	var pw = randPw();
	setEncrypted(randomizedId + "pw", pw);
	pwIds[nb] = randomizedId;

    nb++;
	randomizedId = makeid();
	setEncrypted(randomizedId, "Top Left to Delete");
	setEncrypted(randomizedId + "log", "Btm left to change Color");
    setEncrypted(randomizedId + "color", 'E74C3C');
	setEncrypted(randomizedId + "pw", "Random Password >");
	pwIds[nb] = randomizedId;
    
	setEncrypted("pwIds", pwIds);

	nb = 1;

	randomizedId = makeid();

	// Create new row with a random ID
	notesIds[nb] = randomizedId;

	// Save timestamp
	var timestamp = Math.round(new Date().getTime() / 1000);
	var d = new Date(0);

	d.setUTCSeconds(timestamp);

	// Format a human-readable date
	var m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	if (d.getMinutes() < 10) var minutes = '0' + d.getMinutes();
	else var minutes = d.getMinutes();

	var date = m[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear() + ", " + d.getHours() + ':' + minutes;

	var noteTime = notesIds[nb] + "time";
	setEncrypted(noteTime, date);

	// Save Icon
	var noteIcon = notesIds[nb] + "icon";
	setEncrypted(noteIcon, 'fui-heart');

	// Save Welcome text
	var text = '<div>Welcome to Cassius !</div><div><br></div><div>This application aims to be a vault inside your mac, keeping your passwords and your notes safe.&nbsp;</div><div><br></div><div>All notes and passwords are&nbsp;<i>encrypted and saved <b>as you type</b>&nbsp;</i>using the industry standard algorithm AES. That means, no save button, and you and only you can access you data.&nbsp;</div><div><br></div><div>Feel free to change the sync folder under File &gt; Change sync folder. Select here your favourite flavour of cloud ; Bropbox, iLoud, Owncloud, SSHfs, Thumbdrive…&nbsp;A few shortcuts :&nbsp;</div><div><br></div><div><div><b>⌘+ B is for Bold</b><br></div><div><i>⌘+ I is for Italic<br></i></div><div><u>⌘+ U is for Underline</u></div><blockquote>Tab is for indent</blockquote>Shift + tab is for de-indent. This one may be tricky, but it\'s awesome for checklists !</div><div><br></div><div>Notes and passwords are &nbsp;drag\'n\'droppable, and there is a crop HTML button that you may find usefull if you paste content from the web. The others icons are here for changing your password, logout, delete a note and add a note. You can change a note icon by clicking on it.</div><div><br></div><div>This is an open-source application, and you\'re more than welcome to come and review the code ! It has been released under the term of the GNU GPL v3.</div><div><br></div><div>You can also follow me on&nbsp;<a href="https://twitter.com/pldwan">Twitter</a>, for news and updates !</div><div><br></div><div>Have fun using Cassius !</div><div>@pldwan</div>';
    
    
	var title = "Welcome !"
	var noteTitle = notesIds[nb] + "title";

    setEncrypted(notesIds[nb], text);
    setEncrypted(noteTitle, title);
	setEncrypted("notesIds", notesIds);
	setEncrypted('actualNote', notesIds[nb]);
}


// Load function
$(window).load(function () {
	var salt = $.jStorage.get("salt");

	// Set a welcome text if first start
	if (!salt) $('.wrong').html('<div class="login-link">Welcome to Cassius !<br>Input you password here, and remember it !</div>');
});


// Rand ID Generator
function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	do {
		var mostImprobableCase = false;

		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		// Scan for doublon
		if (notesIds)
			for (var i = 0, c = notesIds.length; i < c; i++) {
				if (notesIds[i] == text) mostImprobableCase = true; // !
			}

		// Scan for doublon
		if (pwIds)
			for (var i = 0, c = pwIds.length; i < c; i++) {
				if (pwIds[i] == text) mostImprobableCase = true; // !
			}

	} while (mostImprobableCase);

	return text;
}


function setCursorToEnd(ele) {
	var range = document.createRange();
	var sel = window.getSelection();
	range.setStart(ele, 1);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
	ele.focus();
}
                        

// Sanitize pasted elements
$(document).on("paste", ".titlePw", function () {
	console.log('Pasted Title !');
	$(this).delay(10).queue(function (n) {
		var id = $(this).parent("div").attr("id");

		// Sanitize
		$(this).text($(this).text());

		// Get HTML and add style
		var title = $(this).html();
		$(this).html( title);

		setCursorToEnd($(this).get(0));
		setEncrypted(id, title);
		n();
	});
});


$(document).on("paste", ".log", function () {
	console.log('Pasted Log !');
	$(this).delay(10).queue(function (n) {
		var id = $(this).parent("div").attr("id");

		$(this).text($(this).text());
		var log = $(this).html();

		setCursorToEnd($(this).get(0));
		setEncrypted(id + 'log', log)
		n();
	});
});


// Pasted note, parse and remove style
var walk_the_DOM = function walk(node, func) {
	func(node);
	node = node.firstChild;
	while (node) {
		walk(node, func);
		node = node.nextSibling;
	}
};


// Sanitize
$(document).on("dblclick", "#crop", function () {

        $('#ameliorer').focus();

        var html = $('#ameliorer').html();
        
        var el = document.getElementById("ameliorer");
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        walk_the_DOM(wrapper, function (el) {
            if (el.removeAttribute) {
                 el.removeAttribute('id');
                 el.removeAttribute('style');
                 el.removeAttribute('class');
                 el.removeAttribute('code');
                 el.removeAttribute('span');
                 el.removeAttribute('pre');
                 el.removeAttribute('h1');
                 el.removeAttribute('h2');
                 el.removeAttribute('h3');
                 el.removeAttribute('div');
            }
        });
        result = wrapper.innerHTML;
               
       $('#ameliorer').html(result);
                                       
});


// Save PW Info as soon as possible
$(document).on("keyup", ".titlePw", function () {
    var id = $(this).parent().parent("div").attr("id");
	var title = $(this).html();

	setEncrypted(id, title);
});

$(document).on("keyup", ".log", function () {
	var id = $(this).parent("div").attr("id");
	var log = $(this).html();
	setEncrypted(id + 'log', log);
});


// Tipsy
$('#moar').tipsy({gravity: 'ne',fade: true,delayIn: 700,opacity: 0.9});
$('#less').tipsy({gravity: 'ne',fade: true,delayIn: 700,opacity: 0.9});
$('#logout').tipsy({gravity: 'n',fade: true,delayIn: 700,opacity: 0.9});
$('#change').tipsy({gravity: 'n',fade: true,delayIn: 700,opacity: 0.9});
$('#crop').tipsy({gravity: 'n',fade: true,delayIn: 700,opacity: 0.9});


// Moar notes !
$(document).on("click", "#moar", function () {

	$('#fuiSelector').fadeOut('fast');

	var randomizedId = makeid();
    if(notesIds[0]=='password'){
        notesIds.unshift(randomizedId);
        notesIds[1]=notesIds[0];
        notesIds[0]='password';
    }
    else{
        notesIds.unshift(randomizedId);
    }
               
    //console.log(notesIds);

    var timestamp = Math.round(new Date().getTime() / 1000);
	var d = new Date(0);
	d.setUTCSeconds(timestamp);

	var m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    // Avoid 18:3, prefer 18:03
	if (d.getMinutes() < 10) var minutes = '0' + d.getMinutes();
	else var minutes = d.getMinutes();

	var date = m[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear() + ", " + d.getHours() + ':' + minutes;
	var icon = arrayIcons[Math.floor(Math.random() * 33)];

    var colorFlash = '#1ABC9C';
	var stringWithRandID = '<li id=' + randomizedId + ' style="color:' + colorFlash + '"><div class="todo-icon ' + icon + '"> </div> <div class="todo-content"> <h4 style="color:' + colorFlash + '" class="todo-name">New Note </h4><div class="under">' + date + '</div></div> </li>';

	setEncrypted((randomizedId + "icon"), icon);
    setEncrypted((randomizedId + "time"), date);
    setEncrypted((randomizedId + "title"), '');
    setEncrypted((randomizedId), '');
	setEncrypted("notesIds", notesIds);
    
    if(notesIds[0]=='password') $('#password').after(stringWithRandID);
    else $('.todo').prepend(stringWithRandID);
    
    // Highlight for a sec
    $(this).delay(500).queue(function (n) {
                             $('li#' + randomizedId + ', li#' + randomizedId +'> .todo-content > .todo-name').removeAttr("style");
                              n();
                          });

});



// Scroll Notes
$(".todo").sortable({axis: "y", containment: "parent",scroll: true, grid: [0,35], distance: 40, opacity: 0.7, helper: "clone", cursor: "move", stop: function() {
                    $("li").each(function( index ) {
                                   //console.log( index + ": " + $(this).attr('id') );
                                   notesIds[index]=$(this).attr('id');
                                   setEncrypted("notesIds", notesIds);
                                   });
                    }});


// Scroll Pw
$("#pwManager").sortable({ scroll: true, distance: 40, cancel: '[contenteditable]', opacity: 0.7, helper: "clone", cursor: "move",
                         start: function() {
                            if ($window.width() > 1135) $('.spanPw').css('width', '25%');
                            else {
                                $('.spanPw').css('width', '33.33%');
                            }
                          },
                         stop: function() {
                            $(".spanPw").each(function( index ) {
                                      //console.log( index + ": " + $(this).attr('id') );
                                      pwIds[index]=$(this).attr('id');
                                      setEncrypted("pwIds", pwIds);
                                      });
                            
                            if ($window.width() > 1135) $('.spanPw').css('width', '25%');
                            else {
                                $('.spanPw').css('width', '33%');
                                $('.spanPw:nth-child(3n+3)').css('width', '34%');
                            }
                         }
                    });



// Change Color
$(document).on("click", "#changeColor", function () {
               var id = $(this).parent().attr('id');
               var color = colorArray[Math.floor(Math.random() * colorArray.length)];
               $(this).parent().css('background-color', '#' + color);
               setEncrypted(id+'color', color);
               });


// Moar PW
$(document).on("click", "#moarPw", function () {
               
    var color;
    do{
        //debugger;
        color = colorArray[Math.floor(Math.random() * colorArray.length)];
    }while((getEncrypted(pwIds[pwIds.length-1]+'color')==color) || (getEncrypted(pwIds[pwIds.length-3]+'color')==color) || (getEncrypted(pwIds[pwIds.length-4]+'color')==color))
	
    // Id
	var randomizedId = makeid();
	var stringWithRandID = '<div id="' + randomizedId + '" class="spanPw" style="background-color:#' + color + '; overflow:hidden;"> <h3><div class="titlePw" contenteditable="true">Website</div></h3>  <div class="log" contenteditable="true">Admin</div>   <div class="pw" contenteditable="true">##########</div><i id="random" original-title="Random Password (Double Click)" class="icon-random" style="opacity:1;"></i><i id="changeColor" original-title="Change Color" class="icon-repeat" style="opacity:1;"></i><div original-title="Delete Password (Double Click)" id="deletePw" style="opacity:1;" class="fui-cross"></div></div>';

	$("#pwManager").append(stringWithRandID);
	setEncrypted(randomizedId, "Website");
	setEncrypted(randomizedId + "log", "Admin");
    setEncrypted(randomizedId + "color", color);
    setEncrypted(randomizedId + "pw", randPw());

	// Resize for greater goods
	if ($.browser.mozilla) {
		if ($window.width() > 1135) $('.spanPw').css('width', (($window.width() - ffoffset4) / 4));
		else $('.spanPw').css('width', (($window.width() - ffoffset3) / 3));
		$('.spanPw').css('height', '110');
	} else {
		if ($window.width() > 1135) $('.spanPw').css('width', '25%');
        else {
            $('.spanPw').css('width', '33%');
            $('.spanPw:nth-child(3n+3)').css('width', '34%');
        }
	}


	// pwIds
	var nb = pwIds.length;
	pwIds[nb] = randomizedId;
	console.log(pwIds);
	setEncrypted("pwIds", pwIds);

    // Cross Color
	if (pwIds.length < 4 && $window.width() > 1135) $('#moarPw').css('color', '#34495e');
	else if (pwIds.length < 3 && $window.width() < 1135) $('#moarPw').css('color', '#34495e');
	else $('#moarPw').css('color', '#fff');
               
    $(this).delay(1000).queue(function (n) {
                                        $('#'+randomizedId+' #changeColor,'+' #'+ randomizedId +' #deletePw,'+' #'+randomizedId+' #random').removeAttr("style");
                                        n();
                                        });

});


// Save title asap
$('#noteTitle').keyup(function () {

	$('#fuiSelector').fadeOut('fast');

	var title = $("#noteTitle").val();

    if (title.length === 0 || title == " ") {
		$("#noteTitle").val("");
		title = "New Note";
	}

    $('li#' + actualNote + ' div.todo-content h4.todo-name').html(title);
                      
	var noteTitle = actualNote + "title";
	setEncrypted(noteTitle, title);
	setEncrypted("notesIds", notesIds);
});


// Save note content asap
$('#ameliorer').keyup(function () {
	setEncrypted(actualNote, $('#ameliorer').html());
});


// Remove Icon selector when not needed
$('#ameliorer').focus(function () {
	$('#fuiSelector').fadeOut('fast');
});
$('#noteTitle').focus(function () {
	$('#fuiSelector').fadeOut('fast');
});
$('#fuiSelector').keyup(function () {
	$('#fuiSelector').fadeOut('fast');
});


// Pw Pasted
$(document).on("paste", ".pw", function () {
	console.log('Pasted Pw !');

	$(this).delay(10).queue(function (n) {
		var id = $(this).parent("div").attr("id");

		$(this).text($(this).text());
		var pw = $(this).html();

		setCursorToEnd($(this).get(0));
		setEncrypted(id + 'pw', pw);

		n();
	});
});


// PW Clicked
$(document).on("focusin", ".pw", function () {
	var id = $(this).parent("div").attr("id");

	var pw = getEncrypted(id + 'pw');
	$(this).html(pw);

	// Set Globals
	pwClicked = true;
	pwClickedId = id;
});


// Pw Unclicked
$(document).on("blur", ".pw", function () {
	$(this).html('##########');
	
    pwClickedId = '';
	pwClicked = false;
});


// Display PW when mouseover
$(document).on("mouseenter", ".pw", function () {

	var id = $(this).parent("div").attr("id");
	if (pwClicked) return;
    var pw = getEncrypted(id + 'pw');
    $(this).html(pw);

});


// Hide when leaving pw
$(document).on("mouseleave", ".pw", function () {
	var id = $(this).parent("div").attr("id");

	if (pwClicked) return;
	//console.log(id + ' mouseleft');

	$(this).delay(300).queue(function (n) {
        if (id != pwClickedId) {
			$(this).html('##########');
			$(this).blur();
		}
		n();
	});

});


// Save pw asap
$(document).on("keyup", ".pw", function () {
	var id = $(this).parent("div").attr("id");
	var pw = $(this).html();

	setEncrypted(id + 'pw', pw);
});


// Random PW
$(document).on("click", "#random", function () {
     
	$(this).animate({"color": "#1ABC9C"}, "fast")
		.delay(200)
		.animate({"color": "#fff"}, "fast")
});


// Random PW
$(document).on("click", "#deletePw", function () {
               $(this).animate({"color": "#1ABC9C"}, "fast")
               .delay(200)
               .animate({"color": "#fff"}, "fast")

               });


// Random PW Generator
function randPw(){
    var salt = (CryptoJS.lib.WordArray.random(128 / 4)).toString(CryptoJS.enc.Base64);
    salt = salt.replace(/\+/g, "");
    salt = salt.replace(/\//g, "");
    salt = salt.replace(/\\/g, "");
    salt = salt.replace(/\=/g, "");
    return salt.substring(0, 15);
}

                        
// Random PW dbl clicked
$(document).on("dblclick", "#random", function () {
	var id = $(this).parent("div").attr("id");

    var pw = randPw();
	$('div#' + id + '.spanPw div.pw').html(pw);

	setEncrypted(id + 'pw', pw);
});


// Hover like function. Not using hover, otherwise it will fade each time we change the icon
$("#save").mouseenter(function () {
    $("#save").animate({"opacity": "-=0.25"}, "fast");
}).mouseleave(function () {
    $("#save").animate({"opacity": "+=1"}, "fast");
});
  
                        
// Less note !
$("#less").dblclick(function () {

	if (actualNote == 'password') return;

	// Hide icon list
	$('#fuiSelector').fadeOut('fast');

	var testCheckList = false;

	if (notesIds.length == 1) return;

	// Check the array and delete the element
	for (var i = 0, c = notesIds.length; i < c; i++) {

		if (notesIds[i] == actualNote && !testCheckList) {

            notesIds[i] = "0";
			$("#" + actualNote).remove();

			if (i === 0) actualNote = notesIds[i + 1];
			else actualNote = notesIds[i - 1];

			var value = getEncrypted(actualNote);
			$("#ameliorer").html(value);

			$('li#' + actualNote).toggleClass("todo-done");

			testCheckList = true;
		}

		// Shift everything as long as possible
		if (testCheckList && i < (notesIds.length - 1)) notesIds[i] = notesIds[i + 1];
	}

	// Remove 1 row
	notesIds.pop();
	//console.log(notesIds);

	// Empty text
	setEncrypted("actualNote", actualNote);

	var valuetitle = getEncrypted(actualNote + "title");

	// Check the value of the title
	if (valuetitle == "New Note") $("#noteTitle").val("");
	else $("#noteTitle").val(valuetitle);

	var valueIcon = getEncrypted(actualNote + "icon");
	$('#save').removeClass();
	$('#save').toggleClass(valueIcon);
                    
    if (actualNote == 'password') {
        $('#toolbar').hide();
        $('#ameliorer').hide();
        $('.rowPw').show();
        $('#moarPw').show();

    } else {
        $('#ameliorer').show();
        $('#toolbar').show();
        $('.rowPw').hide();
        $('#moarPw').hide();
    }


	setEncrypted("notesIds", notesIds);
});


// Less Pw
$(document).on("dblclick", "#deletePw", function () {

	var id = $(this).parent("div").attr("id");
	console.log(id);

	var testCheckList = false;

	// Check the array and delete the element
	for (var i = 0, c = pwIds.length; i < c; i++) {

		if (pwIds[i] == id && !testCheckList) {

            pwIds[i] = "0";
			$('#' + id + '.spanPw').remove();

			if (i === 0) id = pwIds[i + 1];
			else id = pwIds[i - 1];

			testCheckList = true;
		}

		// Shift everything as long as possible
		if (testCheckList && i < (pwIds.length - 1)) pwIds[i] = pwIds[i + 1];
	}

	// Remove 1 row
	pwIds.pop();
	console.log("There are " + pwIds.length + " Pw");
	console.log(pwIds);

	// Save list of notes IDs
	setEncrypted("pwIds", pwIds);

	$("#pwManager").html("");
	loadPw();
});

                        
                        
// Change Icon
$("#save").click(function () {
	$('#fuiSelector').fadeToggle('fast');

});

                        
// logout
$("#logout").click(function () {

	$('#fuiSelector').fadeOut('fast');

	// Empty stuff & logout
	key = '';
	$('.todo').html('');
	$('#noteTitle').val('');
	$('#ameliorer').html('');
	$('#pwManager').html('');

	$('.wrong').html('');
	$('.login1').fadeToggle('fast');
	$('#login-pass').val('');

});


                        
// Unlock
$('#pw').click(function () {
	login();
});

                        

// If enter, login
$('#login-pass').keyup(function (event) {
	if (event.keyCode == 13) login();
});


// Change Icon
$('.iconToSelect').click(function () {

	// Get the FUI Value
	var iconSelected = $(this).attr('class');
	var tokens = iconSelected.split(" ");

	var noteIcon = actualNote + "icon";

	// Get Precedent Icon
	var oldIcon = getEncrypted(noteIcon);

	// Save Icon Value
	setEncrypted(noteIcon, tokens[1]);

	$('li#' + actualNote + ' > .todo-icon').removeClass(oldIcon);
	$('li#' + actualNote + ' > .todo-icon').toggleClass(tokens[1]);

	$('#save').removeClass();
	$('#save').toggleClass(tokens[1]);

	$('#fuiSelector').fadeOut('fast');

});


// Change PW Icon clicked, show content
$('#change').click(function () {
	$('#fuiSelector').fadeOut('fast');
	$('.changePw').fadeToggle('fast');
});

                        
// Change PW...
$('#changePwButton').click(function () {
	changePw();
});
                        

// Cancel Change PW
$('#cancelChangePw').click(function () {
	$('.changePw').fadeToggle('fast');
});

                        
// Another note is clicked 
$('li').livequery('click', function () {

	$('#fuiSelector').fadeOut('fast');

	var text = $('#ameliorer').html();
	setEncrypted(actualNote, text);

    actualNote = $(this).attr('id');

    // Highlight
	$('li').removeClass('todo-done')
	$(this).toggleClass("todo-done");


    var value = getEncrypted(actualNote);

	if (!value) value = ' ';
	$("#ameliorer").html(value);
    $("#ameliorer").blur();

    // Title
    var valuetitle = getEncrypted(actualNote + "title");
    if (valuetitle == "New Note") $("#noteTitle").val("");
	else $("#noteTitle").val(valuetitle);

    // Icon
	var valueIcon = getEncrypted(actualNote + "icon");
	$('#save').removeClass();
	$('#save').toggleClass(valueIcon);


    setEncrypted('actualNote', actualNote);

	if (actualNote == 'password') {
		$('#toolbar').hide();
		$('#ameliorer').hide();
		$('.rowPw').show();
		$('#moarPw').show();
	} else {
		$('#ameliorer').show();
		$('#toolbar').show();
		$('.rowPw').hide();
		$('#moarPw').hide();
	}

});