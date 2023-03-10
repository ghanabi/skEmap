/*
 * Copyright 2008-2009 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.sk.web;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springmodules.validation.commons.DefaultBeanValidator;

import com.sk.SkShipVO;
import com.sk.service.LibJson;
import com.sk.service.mapService;

import egovframework.rte.fdl.property.EgovPropertyService;

/**
 * @Class Name : EgovSampleController.java
 * @Description : EgovSample Controller Class
 * @Modification Information
 * @
 * @  수정일      수정자              수정내용
 * @ ---------   ---------   -------------------------------
 * @ 2009.03.16           최초생성
 *
 * @author 개발프레임웍크 실행환경 개발팀
 * @since 2009. 03.16
 * @version 1.0
 * @see
 *
 *  Copyright (C) by MOPAS All right reserved.
 */

@Controller
public class WebController {	

	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	/** Validator */
	@Resource(name = "beanValidator")
	protected DefaultBeanValidator beanValidator;
	
	@Resource(name = "mapService")
    private mapService mapService;

	LibJson json = new LibJson(); //json 설정
	
	LocalDate now = LocalDate.now();
	 
    // 포맷 정의
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

    // 포맷 적용
    String formatedNow = now.format(formatter);
	
	//초기화면
	@RequestMapping(value = "/index.do")
	public String selectSampleList(ModelMap model) throws Exception {
	
		int cnt = mapService.testCnt();
		System.out.println("ddddddddd : "+cnt);	
		
		return "sk/map/map";
	}
	
	//선박 리스트
	@RequestMapping("getShipList.do")
	public void getStationList(HttpServletRequest req, HttpServletResponse res) throws Exception {
		System.out.println("getStationList : start!");		
		
//		System.out.println(req.getParameter("lon1"));
//		System.out.println(req.getParameter("lon2"));
//		System.out.println(req.getParameter("lat1"));
//		System.out.println(req.getParameter("lat2"));
		
		SkShipVO vo = new SkShipVO();
		vo.setLon1((String)req.getParameter("lon1"));
		vo.setLon2((String)req.getParameter("lon2"));
		vo.setLat1((String)req.getParameter("lat1"));
		vo.setLat2((String)req.getParameter("lat2"));
		vo.setShipname((String)req.getParameter("text"));
		vo.setKind((String)req.getParameter("kind"));
		vo.setTable_nm("SPM.dbo.TB_AIS123_"+(String)req.getParameter("date1"));
		
		List<SkShipVO> slist = mapService.searchTbAisList(vo);		
		
		System.out.println("slist.size() : "+slist.size());
		if(slist.size() > 0) {			
			/*json으로 정보 전달*/
			json.Json(res, slist);
		}				
	}
	
	//선박 리스트
	@RequestMapping("getShipList2.do")
	public void getShipList(HttpServletRequest req, HttpServletResponse res) throws Exception {
		System.out.println("getStationList2 : start!");		
		
		SkShipVO vo = new SkShipVO();
		vo.setLon1((String)req.getParameter("lon1"));
		vo.setLon2((String)req.getParameter("lon2"));
		vo.setLat1((String)req.getParameter("lat1"));
		vo.setLat2((String)req.getParameter("lat2"));
		vo.setShipname((String)req.getParameter("text"));
		vo.setKind((String)req.getParameter("kind"));
		vo.setTable_nm("SPM.dbo.TB_AIS123_"+(String)req.getParameter("date1"));
		
		List<SkShipVO> slist = mapService.getShipList(vo);		
		
		System.out.println("slist.size() : "+slist.size());
		if(slist.size() > 0) {			
			/*json으로 정보 전달*/
			json.Json(res, slist);
		}				
	}
	
	//선박정보 리스트
	@RequestMapping("getShipSearch.do")
	public void getShipSearch(HttpServletRequest req, HttpServletResponse res) throws Exception {
		System.out.println("getShipSearch : start!");		
		
		SkShipVO vo = new SkShipVO();
		vo.setShipname((String)req.getParameter("shipname"));
		vo.setTable_nm("SPM.dbo.TB_AIS123_"+formatedNow);
		List<SkShipVO> slist = mapService.getShipSearch(vo);		
		
		System.out.println("slist.size() : "+slist.size());
		if(slist.size() > 0) {			
			/*json으로 정보 전달*/
			json.Json(res, slist);
		}				
	}
	
	//선박정보 리스트
	@RequestMapping("getShipSearch_all.do")
	public void getShipSearch_all(HttpServletRequest req, HttpServletResponse res) throws Exception {
		System.out.println("getShipSearch_all : start!");		
		
		SkShipVO vo = new SkShipVO();
		vo.setShipname((String)req.getParameter("shipname"));
		vo.setTable_nm("SPM.dbo.TB_AIS123_"+formatedNow);
		
		List<SkShipVO> slist = mapService.getShipSearch_all(vo);		
		
		System.out.println("slist.size() : "+slist.size());
		if(slist.size() > 0) {			
			/*json으로 정보 전달*/
			json.Json(res, slist);
		}				
	}
	
	//선박정보 상세정보
	@RequestMapping("getShipSearch_Detail.do")
	public void getShipSearch_Detail(HttpServletRequest req, HttpServletResponse res) throws Exception {
		System.out.println("getShipSearch_Detail : start!");		
		
		SkShipVO vo = new SkShipVO();
		vo.setMmsi((String)req.getParameter("mmsi"));
		vo.setTable_nm("SPM.dbo.TB_AIS123_"+formatedNow);
		
		List<SkShipVO> slist = mapService.getShipSearch_Detail(vo);		
		
		System.out.println("slist.size() : "+slist.size());
		if(slist.size() > 0) {			
			/*json으로 정보 전달*/
			json.Json(res, slist);
		}				
	}
}
