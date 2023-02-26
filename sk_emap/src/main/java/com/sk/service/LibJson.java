package com.sk.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class LibJson {
	
	public void Json (HttpServletResponse res, List<?> lists){
		Gson gson = new Gson();
		String jsonList = gson.toJson(lists);
		res.setContentType("application/json");
		res.setCharacterEncoding("utf-8");
		try {
			res.getWriter().write(jsonList);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("error");
		}
	}
	
	public void Json_String (HttpServletResponse res, String str){		
		res.setContentType("application/json");
		res.setCharacterEncoding("utf-8");
		try {
			res.getWriter().write(str);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("error");
		}
	}	
}
