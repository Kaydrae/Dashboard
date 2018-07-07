document.addEvent('domready', function(){
  var _wheel = $('wheel');
  
  $$('a').addEvent('click', function(){
    
    if (!this.hasClass('selected')) {
      $$('a.selected').removeClass('selected');
      var that = this;
      that.addClass('selected');
      _wheel.erase('class');
      
      setTimeout(function(){
        _wheel.addClass(that.get('data-speed'));
      }, 5);
      document.body.setStyle('background',this.get('data-bg'));
    }
  });
  
});