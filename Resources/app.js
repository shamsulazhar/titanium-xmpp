/*
* Single Window Application Template:
* A basic starting point for your application.  Mostly a blank canvas.
*
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*
*/

//bootstrap and check dependencies
if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname, version = Ti.Platform.version, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;

	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	} else {
		// Android uses platform-specific properties to create windows.
		// All other platforms follow a similar UI pattern.
		if (osname === 'android') {
			Window = require('ui/handheld/android/ApplicationWindow');
		} else {
			Window = require('ui/handheld/ApplicationWindow');
		}
	}
	new Window().open();

	var debug = function(a) {
		Ti.API.debug("Handled:" + a);
	}
	
	
	function handleIQ(oIQ) {
		con.send(oIQ.errorReply(JXMPP.CONSTANTS.ERR_FEATURE_NOT_IMPLEMENTED));

	}
	
	
	function sendMsg(to,body) {
  
	    var oMsg = new JXMPP.Packet.JXMPPMessage();
	    oMsg.setTo(new JXMPPJID(to));
	    oMsg.setBody(body);
	    con.send(oMsg);

	}

	function handleMessage(message) {
		
		Ti.API.log("From:"+message.getFromJID()+"\n Message:"+message.getBody());
		sendMsg("marjo@jabberes.org","Test text");
	}

/*
	function handlePresence(oJSJaCPacket) {
		var html = '<div class="msg">';
		if (!oJSJaCPacket.getType() && !oJSJaCPacket.getShow())
			html += '<b>' + oJSJaCPacket.getFromJID() + ' has become available.</b>';
		else {
			html += '<b>' + oJSJaCPacket.getFromJID() + ' has set his presence to ';
			if (oJSJaCPacket.getType())
				html += oJSJaCPacket.getType() + '.</b>';
			else
				html += oJSJaCPacket.getShow() + '.</b>';
			if (oJSJaCPacket.getStatus())
				html += ' (' + oJSJaCPacket.getStatus().htmlEnc() + ')';
		}
		html += '</div>';

		document.getElementById('iResp').innerHTML += html;
		document.getElementById('iResp').lastChild.scrollIntoView();
	}
	
	function handleDisconnected() {
		document.getElementById('login_pane').style.display = '';
		document.getElementById('sendmsg_pane').style.display = 'none';
	}

	function handleIqTime(iq) {
		var now = new Date();

		var x=[iq.buildNode('display', now.toLocaleString()), iq.buildNode('utc', now.jabberDate()), iq.buildNode('tz', now.toLocaleString().substring(now.toLocaleString().lastIndexOf(' ') + 1))];
		iq.reply(x);
		con.send();
		return true;
	}

*/
	function handleError(e) {
		if (con.connected())
			con.disconnect();
	}

	function handleStatusChanged(status) {
		alert("status changed: " + status);
	}

	function handleConnected() {
		con.send(new JXMPP.Packet.Presence());
		//sendMsg("marjo@jabberes.org","Test!");
	}

	

	function handleIqVersion(iq) {
		var x=[iq.buildNode('name', 'jsjac simpleclient'), 
				iq.buildNode('version', JXMPP.Version), 
				iq.buildNode('os', "navigator.userAgent")];
		Ti.API.log("xxx:"+x);
		var a=iq.reply(x);
		con.send(a);
		return true;
	}



	function setupCon(oCon) {
		oCon.registerHandler('message', handleMessage);
		oCon.registerHandler('presence', debug);
		oCon.registerHandler('iq', handleIQ);
		oCon.registerHandler('onconnect', handleConnected);
		oCon.registerHandler('onerror', debug);
		oCon.registerHandler('status_changed', debug);
		oCon.registerHandler('ondisconnect', debug);

		oCon.registerIQGet('query', JXMPP.CONSTANTS.NS_VERSION, handleIqVersion);
		//oCon.registerIQGet('query', JXMPP.Constants.NS_TIME, handleIqTime);
	}


	
	var JXMPP=require("xmpp/JXMPP");
	var con = new JXMPP.Connection();

	setupCon(con);

	// setup args for connect method
	oArgs = new Object();
	oArgs.host = "jabberes.org";
	oArgs.domain = "jabberes.org";
	oArgs.username = "jmartin";
	oArgs.resource = 'JXMPP_simpleclients';
	oArgs.pass = "x";
	oArgs.register = false;
	con.connect(oArgs);

})();
