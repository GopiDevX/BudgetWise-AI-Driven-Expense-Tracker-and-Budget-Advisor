package com.budgetwise.repository;

import com.budgetwise.model.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    
    Optional<OtpToken> findByEmailAndPurposeAndVerifiedFalse(String email, OtpToken.OtpPurpose purpose);
    
    Optional<OtpToken> findByEmailAndPurposeAndVerifiedTrue(String email, OtpToken.OtpPurpose purpose);
    
    @Query("SELECT o FROM OtpToken o WHERE o.email = :email AND o.otp = :otp AND o.purpose = :purpose AND o.verified = false AND o.expiryTime > :currentTime")
    Optional<OtpToken> findValidOtp(@Param("email") String email, 
                                   @Param("otp") String otp, 
                                   @Param("purpose") OtpToken.OtpPurpose purpose, 
                                   @Param("currentTime") LocalDateTime currentTime);
    
    void deleteByEmailAndPurpose(String email, OtpToken.OtpPurpose purpose);
}
