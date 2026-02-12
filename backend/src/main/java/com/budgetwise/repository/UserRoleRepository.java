package com.budgetwise.repository;

import com.budgetwise.model.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    
    List<UserRole> findByUserId(Long userId);
    
    List<UserRole> findByRoleId(Long roleId);
}
