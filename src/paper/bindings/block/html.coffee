type = require "type-component"

# HTML section for 
class HtmlDecor extends require("./base")
    
  ###
  ###

  _onChange: (value, oldValue) -> 

    if oldValue?.__isLoader
      oldValue.section.hide()

    unless value
      return @section.removeChildNodes() 

    if value.__isLoader
      node = value.section.show().toFragment()
    else if value.nodeType?
      node = value
    else 

      if @nodeFactory.name is "string"
        node = @nodeFactory.createTextNode String value
      else
        dom = @nodeFactory.createElement "div"
        dom.innerHTML = String value
        node = @nodeFactory.createFragment dom.childNodes


    @section.replaceChildNodes node


module.exports = HtmlDecor