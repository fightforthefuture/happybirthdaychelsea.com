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
        
        new ShareModalController({
        	headline: 'Thanks—we\'ll send your card!',
        	text: 'Please share this page, and consider making a small donation to cover the cost of printing and postage. $4.20 lets us send 5 more cards! Whatever is\'nt spent on cards will go to supporting her work from jail.'
        });
        this.el.style.display = 'none';
        document.getElementById('share').style.display = 'inline';
        
        return false;
    },
})

new BirthdayController({el: '#amibeingdetained'});
window.DONATE_URL = 'https://donate.fightforthefuture.org/campaigns/birthday/page-1/?tag=chelseabirthday';