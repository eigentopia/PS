var FontLibrary = function(){
    this.getFont_MENUNAME = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 38, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true};
    }
    
    this.getFont_SUBNAV = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 32, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true, maxLines: 1};
    }
    
    this.getFont_MENUITEM = function(){
        return {font: FontLibrary.FONT.BOLD, size: 33, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true};
    }


    this.getFont_RECAPDATA = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 19, color: [193/255, 205/255, 193/255, 1.0], preserveSpaces: true};
    }
    this.getFont_RECAPTEXT = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 19, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true};
    }
    
    // Slideshow
    this.getFont_SLIDESHOWPROMOTIONALMESSAGE = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 25, color: [255/255, 160/255, 0/255, 1.0], preserveSpaces: true, maxLines: 1, continueMark: '...'};
    }
    this.getFont_SLIDESHOWWHYITCRACKLES = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 27, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true, maxLines: 1, continueMark: '...'};
    }
    
    // Movie Details
    this.getFont_MOVIEDETAILCHAPTERTITLE = function(){
        return {font: FontLibrary.FONT.BOLD, size: 40, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true, maxLines: 1, continueMark: '...'};
    }
    this.getFont_MOVIEDETAILTEXT = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 31, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true, lineSpacing: -8 };
    }
    this.getFont_MOVIEINFOTEXT = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 33, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true};
    }
    this.getFont_MOVIEINFOTEXTRED = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 33, color: [255/255, 51/255, 51/255, 1.0], preserveSpaces: true};
    }
    this.getFont_MOVIEDETAILSRATING = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 33, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true, maxLines: 1};
    }
    this.getFont_MOVIEDETAILSLENGTHLINE = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 33, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true, maxLines: 1};
    }
    this.getFont_MOVIEDETAILSDISABLED = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 31, color: [130/255, 130/255, 130/255, 1.0], preserveSpaces: true};
    }
    
    // Show Details
    this.getFont_SHOWDETAILCHAPTERTITLE = function(){
        return {font: FontLibrary.FONT.BOLD, size: 40, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true, maxLines: 1, continueMark: '...'};
    }
    this.getFont_SHOWDETAILTEXT = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 31, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true, lineSpacing: -8 };
    }
    this.getFont_SHOWINFOTEXT = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 33, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true};
    }
    this.getFont_SHOWDETAILSDISABLED = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 31, color: [130/255, 130/255, 130/255, 1.0], preserveSpaces: true};
    }
    
    // Show Details
    this.getFont_EPISODEMENU = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 26, color: [0/255, 0/255, 0/255, 1.0], preserveSpaces: true, lineSpacing: -10, maxLines: 1, continueMark: '...' };
    }
    this.getFont_EPISODEMENUBUTTON = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 32, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true};
    }
    
    // Bubble Widget
    this.getFont_BUBBLETITLE = function(){
        return {font: FontLibrary.FONT.BOLD, size: 35, color: [0, 0, 0, 1.0], alignment: 'right', lineBreak: true, continueMark: '...', maxLines: 1};
    }
    this.getFont_BUBBLEWHYITCRACKLES = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 34, color: [255/255, 102/255, 0, 1.0], preserveSpaces: true, maxLines: 1, continueMark: '...'};
    }
    this.getFont_BUBBLELENGTH = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 26, color: [0, 0, 0, 1.0], preserveSpaces: true, maxLines: 1, rightMargin: 400};
    }
    this.getFont_BUBBLEDESCRIPTION = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 34, color: [0, 0, 0, 1.0], preserveSpaces: true, maxLines: 3, continueMark: '...', lineSpacing: -6 };
    }
    
    // Error Widget
    this.getFont_ERRORTITLE = function(){
        return {font: FontLibrary.FONT.BOLD, size: 35, color: [1, 1, 1, 1.0], preserveSpaces: true};
    }
    this.getFont_ERRORMESSAGE = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 38, color: [0, 0, 0, 1.0], preserveSpaces: true};
    }
    
    // About Widget
    this.getFont_ABOUT = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 45, color: [1, 1, 1, 1.0], preserveSpaces: true};
    }
    var currentFont = null;
    // Subtitle Widget
    this.getFont_SUBTITLE = function(){
        if(currentFont !== null){
            return currentFont;
        }
        else{

            var localStorage = engine.storage.local
            var font = {font: FontLibrary.FONT.BOLD, size: 45, color: [255/255, 255/255, 0/255, 1.0], preserveSpaces: true};
            if(localStorage["subFontConfig"]){
                var subFontConfig = JSON.parse(localStorage["subFontConfig"])
                var systemFont;
                switch (subFontConfig.fontType){
                    case 'monospace':
                        systemFont = FontLibrary.FONT.monospace
                        break;
                    case "proportional": 
                        systemFont = FontLibrary.FONT.proportional
                        break
                    case 'monospace_serif':
                        systemFont = FontLibrary.FONT.monospace_serif
                        break;
                    case "proportional_serif": 
                        systemFont = FontLibrary.FONT.proportional_serif
                        break
                    case 'casual':
                        systemFont = FontLibrary.FONT.casual
                        break;
                    case "cursive": 
                        systemFont = FontLibrary.FONT.cursive
                        break
                    case 'small_caps':
                        systemFont = FontLibrary.FONT.small_caps
                        break;
                }

                font.font = systemFont
                font.size = 45//subFontConfig.size;
                font.color[0] = subFontConfig.fontColor[0]/255 *100
                font.color[1] = subFontConfig.fontColor[1]/255 *100
                font.color[2] = subFontConfig.fontColor[2]/255 *100
                font.color[3] = subFontConfig.fontColor[3]
                font.preserveSpaces= true
            }
            currentFont = font;    
            return font
        }
    }
    this.getFont_SUBTITLECHOOSER = function(){
        return {font: FontLibrary.FONT.BOLD, size: 40, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true};
    }
    this.getFont_SUBTITLECHOOSERACTIVE = function(){
        return {font: FontLibrary.FONT.BOLD, size: 40, color: [255/255, 160/255, 0/255, 1.0], preserveSpaces: true};
    }
    this.getFont_SUBTITLEOPTIONS = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 26, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true};
    }
    this.getFont_SUBTITLEOPTIONSNAVIGATION = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 26, color: [153/255, 153/255, 153/255, 1.0], preserveSpaces: true};
    }

    // Media Rating Widget
    this.getFont_NOTYETRATED = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 28, color: [70/255, 70/255, 70/255, 1.0], preserveSpaces: true};
    }

    // Show Details Sub Menu Widget
    this.getFont_MENUCAPTION = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 28, color: [1, 1, 1, 1.0], preserveSpaces: true};
    }
    
    this.getFont_PLAYLISTMENU = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 26, color: [0/255, 0/255, 0/255, 1.0], preserveSpaces: true, maxLines: 1, continueMark: '...'};
    }
    this.getFont_PLAYLISTMENUBUTTON = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 32, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true};
    }
    
    // Disclaimer
    this.getFont_DISCLAIMERTITLE = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 80, color: [255/255, 115/255, 0/255, 1.0], preserveSpaces: true};
    }
    this.getFont_DISCLAIMERTEXT = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 34, color: [1, 1, 1, 1.0], preserveSpaces: true};
    }
    this.getFont_DISCLAIMERCENTERTEXT = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 34, color: [1, 1, 1, 1.0], preserveSpaces: true, alignment: 'center'};
    }
    this.getFont_DISCLAIMERBUTTON = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 48, color: [1, 1, 1, 1.0], preserveSpaces: true, alignment: 'center'};
    }

    this.getFont_CURRENTTIMETIMELINE = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 20, color: [1, 1, 1, 1.0], preserveSpaces: true, alignment: 'center'};
    }

    this.getFont_NAVIGATIONCONTROL = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 22, color: [130/255, 130/255, 130/255, 1.0], preserveSpaces: true, alignment: 'center'};
    }

    this.getFont_SUBMENUHEADER = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 20, color: [97/255, 97/255, 97/255, 1.0], preserveSpaces: true, alignment: 'center'};
    }
    this.getFont_ERRORBUTTON = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 48, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true, alignment: 'center'};
    }
    this.getFont_TABBUTTON = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 41, color: [1,1,1, 1.0], preserveSpaces: true, alignment: 'center'};
    }
    this.getFont_TABBUTTONINACTIVE = function(){
        return {font: FontLibrary.FONT.NORMAL, size: 41, color: [76/255, 76/255, 76/255, 1.0], preserveSpaces: true, alignment: 'center'};
    }
}

if( engine.stats.device.platform == 'html' ){
    FontLibrary.FONT = {
        NORMAL: "Fonts/arial.ttf",
        BOLD: "Fonts/arialbd.ttf"
    };
}else{
    FontLibrary.FONT = {
        NORMAL: "Fonts/arial.ttf",
        BOLD: "Fonts/arialbd.ttf",
        monospace:"Fonts/monospace.ttf",
        proportional:"Fonts/proportional.ttf",
        monospace_serif: "Fonts/monospace_serif.ttf",
        proportional_serif:"Fonts/proportional_serif.ttf",
        casual:"Fonts/casual.ttf",
        cursive:"Fonts/cursive.ttf",
        small_caps:"Fonts/small_caps.ttf"

    };
}

FontLibraryInstance = new FontLibrary();