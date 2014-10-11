
include( "js/app/com/dadc/lithium/util/RGBLibrary.js" );

var ShaderCreator = function(){
    
    this.createSolidColorShader = function( RGBLibrary_COLOR ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpSolidColor.cg" );
            tmp_shader.fillColor = RGBLibrary_COLOR;
        return tmp_shader;
    }
    
    this.createAlphaShader = function( _alpha ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpAlphaPNG.cg" );
            tmp_shader.alpha = _alpha;
        return tmp_shader;
    }
    this.createAlphaMaskShader = function( _alpha, _texture, _mask ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpAlphaMask.cg" );
            tmp_shader.alpha = _alpha;
            tmp_shader.texture = _texture;
            tmp_shader.mask = _mask;
        return tmp_shader;
    }

    this.createAlphaColorShader = function( _alpha, RGBLibrary_COLOR ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpAlphaColor.cg" );
            tmp_shader.alpha = _alpha;
            tmp_shader.fillColor = RGBLibrary_COLOR;
        return tmp_shader;
    }

    this.createAlphaTextureShader = function( _alpha, _texture ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpAlphaTexture.cg" );
            tmp_shader.alpha = _alpha;
            tmp_shader.texture = _texture;
        return tmp_shader;
    }    

    this.createBlurShader = function( blur_radius ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpBlur.cg" );
            tmp_shader.blurRadius = blur_radius;
        return tmp_shader;
    }

    // this.createAlphaColorShader = function( RGBLibrary_COLOR ){
    //     var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpAlphaColor.cg" );
    //         tmp_shader.fillColor = RGBLibrary_COLOR;
    //     return tmp_shader;
    // }    

    // todo: i don't think this is making a copy, upgrade so that it is.
    this.create9SliceShader = function( source_image, rounding_width, rounding_height, uf4_multiply_color ){
        var tmp_shader = engine.createShader("Shaders/vpBasic.cg", "Shaders/fp9Slice.cg");
        var tmp_slate = engine.createSlate();
            tmp_slate.width = source_image.width;
            tmp_slate.height = source_image.height;
            tmp_slate.shader = tmp_shader;
            tmp_slate.shader.texture = source_image.shader.texture;
            
            //source_image.shader = tmp_shader;
            tmp_slate.shader.width = source_image.naturalWidth;
            tmp_slate.shader.height = source_image.naturalHeight;
            tmp_slate.shader.top = rounding_height;
            tmp_slate.shader.bottom = source_image.naturalHeight - rounding_height;
            tmp_slate.shader.left = rounding_width;
            tmp_slate.shader.right = source_image.naturalWidth - rounding_width;
            tmp_slate.shader.multiplyColor = uf4_multiply_color;
        return tmp_slate;
    }

    /**
     * CANT GET THIS TO WORK YET
     */ 
    this.createReflectionShader = function( f4color_top, f4color_bottom, f_diverge_top, f_diverge_bottom ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpReflection.cg" );
            tmp_shader.colorTop = f4color_top;
            tmp_shader.colorBottom = f4color_bottom;
            tmp_shader.divergenceTop = f_diverge_top;
            tmp_shader.divergenceBottom = f_diverge_bottom;
        return tmp_shader;
    }
    
    this.createGlowShader = function( glow_radius, glow_color, text_color ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpGlow.cg" );
            tmp_shader.glowRadius = glow_radius;
            tmp_shader.glowColor = glow_color;
            tmp_shader.textColor = text_color;
        return tmp_shader;
    }
    this.createHorizontalGradientShader = function( start_position, end_position ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpHorizontalGradient.cg" );
            tmp_shader.startPosition = start_position;
            tmp_shader.endPosition = end_position;
        return tmp_shader;
    }
    this.createHorizontalTextureGradientShader = function( start_position, end_position, start_color, end_color ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpHorizontalTextureGradient.cg" );
            tmp_shader.startPosition = start_position;
            tmp_shader.endPosition = end_position;
            tmp_shader.startColor = start_color;
            tmp_shader.endColor = end_color;
        return tmp_shader;
    }    
    this.createVerticalTextureGradientShader = function( start_position, end_position, start_color, end_color ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpVerticalTextureGradient.cg" );
            tmp_shader.startPosition = start_position;
            tmp_shader.endPosition = end_position;
            tmp_shader.startColor = start_color;
            tmp_shader.endColor = end_color;
        return tmp_shader;
    }    
    this.createBoxShader = function( thickness, distance, box_color, inner_glow, inner_glow_color, outer_glow, outer_glow_color, fill_color_top, fill_color_bottom, fill_position_top, fill_position_bottom, texture_color ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpBox.cg" );
            tmp_shader.thickness = thickness;
            tmp_shader.distance = distance;
            tmp_shader.boxColor = box_color;
            tmp_shader.innerGlow = inner_glow;
            tmp_shader.innerGlowColor = inner_glow_color;
            tmp_shader.outerGlow = outer_glow;
            tmp_shader.outerGlowColor = outer_glow_color;
            tmp_shader.fillColorTop = fill_color_top;
            tmp_shader.fillColorBottom = fill_color_bottom;
            tmp_shader.fillPositionTop = fill_position_top;
            tmp_shader.fillPositionBottom = fill_position_bottom;
            tmp_shader.textureColor = texture_color;
        return tmp_shader;
    }
    this.createBlurredRectShader = function( radius, RGBLibrary_COLOR ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpBlurredRect.cg" );
            tmp_shader.radius = radius;
            tmp_shader.fillColor = RGBLibrary_COLOR;
        return tmp_shader;
    }
    this.createTextureShader = function( texture ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpTexture.cg" );
            tmp_shader.texture = texture;
        return tmp_shader;
    }
    this.createRecolorShader = function( fill_color, replace_color ){
        var tmp_shader = engine.createShader( "Shaders/vpBasic.cg", "Shaders/fpRecolor.cg" );
            tmp_shader.fillColor = fill_color;
            tmp_shader.replaceColor = replace_color;
        return tmp_shader;
    }
    
}

ShaderCreatorInstance = new ShaderCreator();