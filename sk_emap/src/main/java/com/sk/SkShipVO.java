package com.sk;

import java.io.Serializable;

import org.apache.commons.lang3.builder.ToStringBuilder;

/**
 *  클래스
 * @author 공통서비스개발팀 이삼섭
 * @since 2009.06.01
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자           수정내용
 *  -------       --------    ---------------------------
 *   2009.3.11   이삼섭          최초 생성
 *
 * </pre>
 */
public class SkShipVO implements Serializable {
    
	/** mmsi */
    private String mmsi = "";

    /** timeStampK */
    private String timestampk = "";

    /** Latitude */
    private String latitude = "";

    /** Longtiude */
    private String longitude = "";
    
    /** lon1 */
    private String lon1 = "";
    
    /** lon2 */
    private String lon2 = "";
    
    /** lat1 */
    private String lat1 = "";
    
    /** lat2 */
    private String lat2 = "";
    
    /** 선박명 */
    private String shipname = "";
    
    /** 날짜1 */
    private String date1 = "";

    /** 날짜2 */
    private String date2 = "";

    /** mmsi/선박명 */
    private String kind = "";
    
    /** 최초 timeStampK */
    private String min_timestampk = "";

    /** 최종 timeStampK */
    private String max_timestampk = "";
    
    
    

	public String getShipname() {
		return shipname;
	}

	public void setShipname(String shipname) {
		this.shipname = shipname;
	}

	public String getLon1() {
		return lon1;
	}

	public void setLon1(String lon1) {
		this.lon1 = lon1;
	}

	public String getLon2() {
		return lon2;
	}

	public void setLon2(String lon2) {
		this.lon2 = lon2;
	}

	public String getLat1() {
		return lat1;
	}

	public void setLat1(String lat1) {
		this.lat1 = lat1;
	}

	public String getLat2() {
		return lat2;
	}

	public void setLat2(String lat2) {
		this.lat2 = lat2;
	}

	public String getMmsi() {
		return mmsi;
	}

	public void setMmsi(String mmsi) {
		this.mmsi = mmsi;
	}

	public String getTimestampk() {
		return timestampk;
	}

	public void setTimestampk(String timestampk) {
		this.timestampk = timestampk;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getDate1() {
		return date1;
	}

	public void setDate1(String date1) {
		this.date1 = date1;
	}

	public String getDate2() {
		return date2;
	}

	public void setDate2(String date2) {
		this.date2 = date2;
	}

	public String getKind() {
		return kind;
	}

	public void setKind(String kind) {
		this.kind = kind;
	}

	public String getMin_timestampk() {
		return min_timestampk;
	}

	public void setMin_timestampk(String min_timestampk) {
		this.min_timestampk = min_timestampk;
	}

	public String getMax_timestampk() {
		return max_timestampk;
	}

	public void setMax_timestampk(String max_timestampk) {
		this.max_timestampk = max_timestampk;
	}
	
}
