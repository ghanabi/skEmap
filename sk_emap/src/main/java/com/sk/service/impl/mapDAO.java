package com.sk.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.sk.SkShipVO;

import egovframework.com.cmm.service.impl.EgovComAbstractDAO;

/**
 * @Class Name : CmmUseDAO.java
 * @Description : 공통코드등 전체 업무에서 공용해서 사용해야 하는 서비스를 정의하기위한 데이터 접근 클래스
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
@Repository("mapDAO")
public class mapDAO extends EgovComAbstractDAO {

    /**
     * test
     *
     * @param vo
     * @return
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
	public List<Map<String, Object>> test() throws Exception {
	return (List<Map<String, Object>>) list("map.test", null);
    }
    
    @SuppressWarnings("unchecked")
   	public int testCnt() throws Exception {
   	return (int) select("map.testCnt", null);
    }
    
    @SuppressWarnings("unchecked")
   	public List<SkShipVO> searchTbAisList(SkShipVO vo) throws Exception {
    	return (List<SkShipVO>) list("map.searchTbAisList", vo);
    }
    
    @SuppressWarnings("unchecked")
   	public List<SkShipVO> getShipList(SkShipVO vo) throws Exception {
    	return (List<SkShipVO>) list("map.getShipList", vo);
    }
    
    @SuppressWarnings("unchecked")
   	public List<SkShipVO> getShipSearch(SkShipVO vo) throws Exception {
    	return (List<SkShipVO>) list("map.getShipSearch", vo);
    }
    
    @SuppressWarnings("unchecked")
   	public List<SkShipVO> getShipSearch_all(SkShipVO vo) throws Exception {
    	return (List<SkShipVO>) list("map.getShipSearch_all", vo);
    }
    
    @SuppressWarnings("unchecked")
   	public List<SkShipVO> getShipSearch_Detail(SkShipVO vo) throws Exception {
    	return (List<SkShipVO>) list("map.getShipSearch_Detail", vo);
    }
}
