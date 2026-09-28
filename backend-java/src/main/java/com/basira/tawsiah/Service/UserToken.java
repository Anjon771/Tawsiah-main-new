package com.basira.tawsiah.Service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserToken {

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;
    
}
