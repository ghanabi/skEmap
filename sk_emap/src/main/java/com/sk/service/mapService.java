package com.sk.service;

import java.util.List;
import java.util.Map;

import com.sk.SkShipVO;

public interface mapService {
	public List<Map<String, Object>> test() throws Exception;
	
	public int testCnt() throws Exception;
	
	public List<SkShipVO> searchTbAisList(SkShipVO vo) throws Exception;
	
	public List<SkShipVO> getShipList(SkShipVO vo) throws Exception;
	
	public List<SkShipVO> getShipSearch(SkShipVO vo) throws Exception;
	
	public List<SkShipVO> getShipSearchMapFor30Min(SkShipVO vo) throws Exception;
	
	public List<SkShipVO> getShipSearch_all(SkShipVO vo) throws Exception;
	
	public List<SkShipVO> getShipSearch_Detail(SkShipVO vo) throws Exception;
}
