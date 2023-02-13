const jijukSld =
    '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">' +
    '<NamedLayer>' +
    '<Name>sop:lp_pa_cbnd_bubun</Name>' +
    '<UserStyle>' +
    '<Name>userStyle</Name>' +
    '<FeatureTypeStyle>' +
    '<Name>name</Name>' +
    '<Rule>' +
    '<Title>부번</Title>' +
    '<MaxScaleDenominator>10000.0</MaxScaleDenominator>' +
    '<PolygonSymbolizer>' +
    '<Fill>' +
    '<CssParameter name="fill">#FFFFFF</CssParameter>' +
    '<CssParameter name="fill-opacity">0</CssParameter>' +
    '</Fill>' +
    '<Stroke>' +
    '<CssParameter name="stroke">#D2B08D</CssParameter>' +
    '</Stroke>' +
    '</PolygonSymbolizer>' +
    '<TextSymbolizer>' +
    '<Geometry>' +
    '<ogc:PropertyName>ag_geom</ogc:PropertyName>' +
    '</Geometry>' +
    '<Label>' +
    '<ogc:PropertyName>jibun</ogc:PropertyName>' +
    '</Label>' +
    '<Font>' +
    '<CssParameter name="font-family">NanumGothicExtraBold</CssParameter>' +
    '<CssParameter name="font-size">10</CssParameter>' +
    '<CssParameter name="font-style">normal</CssParameter>' +
    '</Font>' +
    '<LabelPlacement>' +
    '<PointPlacement>' +
    '<AnchorPoint>' +
    '<AnchorPointX>0.5</AnchorPointX>' +
    '<AnchorPointY>0.5</AnchorPointY>' +
    '</AnchorPoint>' +
    '</PointPlacement>' +
    '</LabelPlacement>' +
    '<Halo>' +
    '<Radius>1.1</Radius>' +
    '<Fill>' +
    '<CssParameter name="fill">#FFFFFF</CssParameter>' +
    '<CssParameter name="fill-opacity">0.85</CssParameter>' +
    '</Fill>' +
    '</Halo>' +
    '<Fill>' +
    '<CssParameter name="fill">#804000</CssParameter>' +
    '</Fill>' +
    '</TextSymbolizer>' +
    '</Rule>' +
    '</FeatureTypeStyle>' +
    '</UserStyle>' +
    '</NamedLayer>' +
    '</StyledLayerDescriptor>';

//const encodedSld = '%3CStyledLayerDescriptor%20xmlns%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%22%20xmlns%3Asld%3D%22http%3A%2F%2Fwww.opengis.net%2Fsld%22%20xmlns%3Aogc%3D%22http%3A%2F%2Fwww.opengis.net%2Fogc%22%20xmlns%3Agml%3D%22http%3A%2F%2Fwww.opengis.net%2Fgml%22%20version%3D%221.0.0%22%3E%0A%3CNamedLayer%3E%0A%3CName%3Elp_pa_cbnd_bubun%3C%2FName%3E%0A%3CUserStyle%3E%0A%3CName%3Elp_pa_cbnd_bubun%3C%2FName%3E%0A%3CFeatureTypeStyle%3E%0A%3CName%3Ename%3C%2FName%3E%0A%3CRule%3E%0A%3CTitle%3E%EB%B6%80%EB%B2%88%3C%2FTitle%3E%0A%3CMaxScaleDenominator%3E3000.0%3C%2FMaxScaleDenominator%3E%0A%3CPolygonSymbolizer%3E%0A%3CFill%3E%0A%3CCssParameter%20name%3D%22fill%22%3E%23FFFFFF%3C%2FCssParameter%3E%0A%3CCssParameter%20name%3D%22fill-opacity%22%3E0.2%3C%2FCssParameter%3E%0A%3C%2FFill%3E%0A%3CStroke%3E%0A%3CCssParameter%20name%3D%22stroke%22%3E%23FF0000%3C%2FCssParameter%3E%0A%3C%2FStroke%3E%0A%3C%2FPolygonSymbolizer%3E%0A%3CTextSymbolizer%3E%0A%3CGeometry%3E%0A%3Cogc%3APropertyName%3Eag_geom%3C%2Fogc%3APropertyName%3E%0A%3C%2FGeometry%3E%0A%3CLabel%3E%0A%3Cogc%3APropertyName%3Ebubun%3C%2Fogc%3APropertyName%3E%0A%3C%2FLabel%3E%0A%3CFont%3E%0A%3CCssParameter%20name%3D%22font-family%22%3ENanumGothicExtraBold%3C%2FCssParameter%3E%0A%3CCssParameter%20name%3D%22font-size%22%3E10%3C%2FCssParameter%3E%0A%3CCssParameter%20name%3D%22font-style%22%3Enormal%3C%2FCssParameter%3E%0A%3C%2FFont%3E%0A%3CLabelPlacement%3E%0A%3CPointPlacement%3E%0A%3CAnchorPoint%3E%0A%3CAnchorPointX%3E0.5%3C%2FAnchorPointX%3E%0A%3CAnchorPointY%3E0.5%3C%2FAnchorPointY%3E%0A%3C%2FAnchorPoint%3E%0A%3C%2FPointPlacement%3E%0A%3C%2FLabelPlacement%3E%0A%3CHalo%3E%0A%3CRadius%3E1.1%3C%2FRadius%3E%0A%3CFill%3E%0A%3CCssParameter%20name%3D%22fill%22%3E%23FFFFFF%3C%2FCssParameter%3E%0A%3CCssParameter%20name%3D%22fill-opacity%22%3E0.85%3C%2FCssParameter%3E%0A%3C%2FFill%3E%0A%3C%2FHalo%3E%0A%3CFill%3E%0A%3CCssParameter%20name%3D%22fill%22%3E%23804000%3C%2FCssParameter%3E%0A%3C%2FFill%3E%0A%3C%2FTextSymbolizer%3E%0A%3C%2FRule%3E%0A%3C%2FFeatureTypeStyle%3E%0A%3C%2FUserStyle%3E%0A%3C%2FNamedLayer%3E%0A%3C%2FStyledLayerDescriptor%3E';