package com.sk.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.sk.SkShipVO;
import com.sk.service.mapService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * @Class Name : EgovCmmUseServiceImpl.java
 * @Description : 공통코드등 전체 업무에서 공용해서 사용해야 하는 서비스를 정의하기위한 서비스 구현 클래스
 * @Modification Information
 *
 *    수정일       수정자         수정내용
 *    -------        -------     -------------------
 *    2009. 3. 11.     이삼섭
 *
 * @author 공통 서비스 개발팀 이삼섭
 * @since 2009. 3. 11.
 * @version
 * @see
 *
 */
@Service("mapService")
public class mapServiceImpl extends EgovAbstractServiceImpl implements mapService {

	@Resource(name = "mapDAO")
	private mapDAO mapDAO;

	/**
	 * 공통코드를 조회한다.
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	@Override
	public List<Map<String, Object>> test() throws Exception {
		return mapDAO.test();
	}
	
	@Override
	public int testCnt() throws Exception {
		return mapDAO.testCnt();
	}
	
	@Override
	public List<SkShipVO> searchTbAisList(SkShipVO vo) throws Exception {
		return mapDAO.searchTbAisList(vo);
	}
	
	@Override
	public List<SkShipVO> getShipList(SkShipVO vo) throws Exception {
		return mapDAO.getShipList(vo);
	}
	
	@Override
	public List<SkShipVO> getShipSearch(SkShipVO vo) throws Exception {
		return mapDAO.getShipSearch(vo);
	}
	
	@Override
	public List<SkShipVO> getShipSearchMapFor30Min(SkShipVO vo) throws Exception {
		return mapDAO.getShipSearchMapFor30Min(vo);
	}
	
	@Override
	public List<SkShipVO> getShipSearch_all(SkShipVO vo) throws Exception {
		return mapDAO.getShipSearch_all(vo);
	}
	
	@Override
	public List<SkShipVO> getShipSearch_Detail(SkShipVO vo) throws Exception {
		return mapDAO.getShipSearch_Detail(vo);
	}
}
