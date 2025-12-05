package com.example.matchescrud.service.interfaces;

import com.example.matchescrud.dto.TeamDTO;
import com.example.matchescrud.dto.UserDTO;
import com.example.matchescrud.exceptions.ApiException;

import java.util.List;

public interface IAdminService {
    UserDTO registerAdmin(UserDTO userDTO) throws ApiException;
    UserDTO login(UserDTO userDTO) throws ApiException;
    List<UserDTO> getAllAdmins();
    TeamDTO deleteTeam(Long id) throws ApiException;
}

