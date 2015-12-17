var BirthdayController = Composer.Controller.extend({
	elements: {
		'ul': 'designs',
		'textarea': 'message',
		'span#remaining': 'remaining',
		'input[name="name"]': 'name',
		'input[name="address"]': 'address',
		'input[name="city"]': 'city',
		'input[name="state"]': 'state',
		'input[name="zip"]': 'zip',
		'input[name="email"]': 'email',
		'input[name="opt_in"]': 'opt_in',
	},
	events: {
		'click li a': 'switchDesign',
		'keyup textarea': 'editMessage',
		'change textarea': 'editMessage',
		'submit form': 'submit'
	},
	
	selectedCard: 'card1',
	
	switchDesign: function(e) {
		if (e)
			e.preventDefault();
		
		for (var i = 0; i < this.designs.childNodes.length; i++)
			this.designs.childNodes[i].className = '';
		
		var target = e.target.parentNode.parentNode;

		target.className = 'sel';
		this.selectedCard = target.id;
	},
	
	editMessage: function(e) {
		var remaining = 350 - this.message.value.length;
		this.remaining.textContent = remaining + ' characters remaining';
		
	},
	
	submit: function(e) {
        e.preventDefault();

        var error = false;

        var add_error = function(el) {
            el.className = 'error';
            error = true;
        };
        
        var required = ['name', 'address', 'city', 'state', 'zip', 'message']
        
        if (!this.message.value)
        	add_error(this.message);

        if (error) return alert('Please fill out all required fields :)');
        
        var formData = new FormData();
        
        for (var i = 0; i < required.length; i++)
        	formData.append(required[i], this[required[i]].value);
		
		if (this.email.value)
			formData.append('email', this.email.value);
		
		if (this.opt_in.checked)
			formData.append('opt_in', 1);
		
		formData.append('design', this.selectedCard);

        var url = '/happy_birthday';

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('response:', xhr.response);
            }
        }.bind(this);
        xhr.open("post", url, true);
        xhr.send(formData);
        
        if (window.TEST_OPTION == 'a')
            new ShareModalController({
            	headline: 'Thanks—we\'ll send your card!',
            	text: 'Please share this page, and consider making a small donation to cover the cost of printing and postage. $4.20 lets us send 5 more cards! Whatever isn\'t spent on cards will go to supporting her work from jail.'
            });
        else if (window.TEST_OPTION == 'b')
            new ShareModalController2({});
        else
            new ShareModalController3({});

        this.el.style.display = 'none';
        document.getElementById('share').style.display = 'inline';
        
        return false;
    },
});

var ShareModalController2 = BaseShareModalController.extend({
    
    headline: 'Thanks—we\'ll send your card!',
    text: 'Please share this page, and consider making a small donation to cover the cost of printing and postage. $4.20 lets us send 5 more cards! Whatever isn\'t spent on cards will go to supporting her work from jail.',

    init: function() {
        this.render();
        this.show();
    },

    render: function() {
        var overlay = this.base_render();

        overlay.firstChild.appendChild(ShareModalView2({
            headline: this.headline,
            text: this.text
        }));

        this.html(overlay);
    }
});

var ShareModalView2 = function(data) {
    var
        modal = $c('div'),
        close = $c('button'),
        headline = $c('h2'),
        copy = $c('p'),
        shares = $c('div'),
        tweet = $c('button'),
        facebook = $c('button'),
        donate = $c('button');

    modal.classList.add('modal', '_call_modal');
    close.classList.add('close');
    shares.classList.add('_call_shares');
    tweet.classList.add('social', 'twitter', 'small');
    facebook.classList.add('social', 'facebook', 'small');
    donate.classList.add('social', 'donate', 'big');

    close.textContent = '⨉';
    headline.textContent = data.headline;
    copy.textContent = data.text;
    tweet.textContent = 'Tweet this';
    facebook.textContent = 'Share this';
    donate.textContent = 'Give $7 to send more cards!';

    shares.appendChild(donate);

    shares.appendChild(tweet);
    shares.appendChild(facebook);

    modal.appendChild(close);
    modal.appendChild(headline);
    modal.appendChild(copy);
    modal.appendChild(shares);

    return modal;

};

var ShareModalController3 = BaseShareModalController.extend({
    
    headline: 'Thanks—we\'ll send your card!',
    text: 'Please share this page, and consider making a small donation to cover the cost of printing and postage. $4.20 lets us send 5 more cards! Whatever isn\'t spent on cards will go to supporting her work from jail.',

    init: function() {
        this.render();
        this.show();
    },

    render: function() {
        var overlay = this.base_render();

        overlay.firstChild.appendChild(ShareModalView3({
            headline: this.headline,
            text: this.text
        }));

        this.html(overlay);
    }
});

var ShareModalView3 = function(data) {
    var
        modal = $c('div'),
        close = $c('button'),
        headline = $c('h2'),
        copy = $c('p'),
        shares = $c('div'),
        tweet = $c('button'),
        facebook = $c('button'),
        donate = $c('button');

    modal.classList.add('modal', '_call_modal');
    close.classList.add('close');
    shares.classList.add('_call_shares');
    tweet.classList.add('social', 'twitter', 'small');
    facebook.classList.add('social', 'facebook', 'small');
    donate.classList.add('social', 'donate', 'big');

    close.textContent = '⨉';
    headline.textContent = data.headline;
    copy.textContent = data.text;
    tweet.textContent = 'Tweet this';
    facebook.textContent = 'Share this';
    donate.textContent = 'Give $7 to send more cards!';

    shares.appendChild(donate);

    modal.appendChild(close);
    modal.appendChild(headline);
    modal.appendChild(copy);
    modal.appendChild(shares);

    return modal;

};


new BirthdayController({el: '#amibeingdetained'});

window.TEST_NAME = 'button-layout-1'

var diceRoll = Math.random();

if (diceRoll < .33) {
    window.TEST_OPTION = 'a';
} else if (diceRoll >= .33 && diceRoll < .66) {
    window.TEST_OPTION = 'b';
} else {
    window.TEST_OPTION = 'c';
}

window.DONATE_URL = 'https://donate.fightforthefuture.org/campaigns/birthday/page-1/?tag=chelseabirthday&testName='+window.TEST_NAME+'&testOption='+window.TEST_OPTION+'&utm_source=happybirthdaychelsea.com&utm_medium=web&utm_campaign='+window.TEST_NAME+'-'+window.TEST_OPTION;

console.log('diceRoll: ', diceRoll,'; testOption: ', window.TEST_OPTION);