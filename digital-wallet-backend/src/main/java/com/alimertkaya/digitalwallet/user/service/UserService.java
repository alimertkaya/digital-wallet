package com.alimertkaya.digitalwallet.user.service;

import com.alimertkaya.digitalwallet.notification.dto.VerifyCodeRequest;
import com.alimertkaya.digitalwallet.user.dto.*;
import com.alimertkaya.digitalwallet.user.entity.User;
import reactor.core.publisher.Mono;

public interface UserService {
    Mono<User> getCurrentUser();
    Mono<UserProfileResponse> getCurrentUserProfile();
    Mono<Void> changePassword(ChangePasswordRequest request);
    // profile
    Mono<UserProfileResponse> updateUserInfo(UpdateUserInfoRequest request);
    Mono<UserProfileResponse> updateEmail(UpdateEmailRequest request);
    Mono<UserProfileResponse> updatePhone(UpdatePhoneRequest request);
    // verification
    Mono<Void> verifyEmail(VerifyCodeRequest request);
    Mono<Void> verifyPhone(VerifyCodeRequest request);
    // yeniden gönderme
    Mono<Void> resendEmailCode();
    Mono<Void> resendPhoneCode();
    Mono<Void> deactivateAccount();
}