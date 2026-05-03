package com.alimertkaya.digitalwallet.user.service.impl;

import com.alimertkaya.digitalwallet.shared.dto.enums.VerificationType;
import com.alimertkaya.digitalwallet.notification.dto.VerifyCodeRequest;
import com.alimertkaya.digitalwallet.user.dto.*;
import com.alimertkaya.digitalwallet.user.entity.User;
import com.alimertkaya.digitalwallet.user.repository.UserRepository;
import com.alimertkaya.digitalwallet.shared.security.SecurityContextHelper;
import com.alimertkaya.digitalwallet.user.service.UserService;
import com.alimertkaya.digitalwallet.notification.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationService verificationService;
    private final SecurityContextHelper securityContextHelper;

    /**
     * Profil işlemleri için DB'den taze kullanıcı verisi gerekiyor;
     * security context'teki principal stale olabilir.
     */
    @Override
    public Mono<User> getCurrentUser() {
        return securityContextHelper.getCurrentUser()
                .flatMap(principal -> userRepository.findByUsername(principal.getUsername()))
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Kullanıcı bulunamadı")));
    }

    @Override
    public Mono<UserProfileResponse> getCurrentUserProfile() {
        return getCurrentUser().map(UserProfileResponse::fromEntity);
    }

    @Override
    public Mono<Void> changePassword(ChangePasswordRequest request) {
        return getCurrentUser()
                .flatMap(user -> {
                    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mevcut şifreniz hatalı!"));
                    }
                    if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yeni şifre eskisiyle aynı olamaz."));
                    }
                    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    return userRepository.save(user);
                })
                .then();
    }

    @Override
    public Mono<UserProfileResponse> updateUserInfo(UpdateUserInfoRequest request) {
        return getCurrentUser()
                .flatMap(user -> {
                    boolean changed = false;
                    if (request.getFirstName() != null && !request.getFirstName().equals(user.getFirstName())) {
                        user.setFirstName(request.getFirstName());
                        changed = true;
                    }
                    if (request.getLastName() != null && !request.getLastName().equals(user.getLastName())) {
                        user.setLastName(request.getLastName());
                        changed = true;
                    }
                    if (request.getBirthDate() != null && !request.getBirthDate().equals(user.getBirthDate())) {
                        user.setBirthDate(request.getBirthDate());
                        changed = true;
                    }
                    if (!changed) return Mono.just(UserProfileResponse.fromEntity(user));
                    return userRepository.save(user).map(UserProfileResponse::fromEntity);
                });
    }

    @Override
    public Mono<UserProfileResponse> updateEmail(UpdateEmailRequest request) {
        return getCurrentUser()
                .flatMap(user -> {
                    if (request.getNewEmail().equals(user.getEmail())) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yeni e-posta eskisiyle aynı olamaz."));
                    }
                    return userRepository.findByEmail(request.getNewEmail())
                            .flatMap(existing -> Mono.<User>error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bu e-posta kullanımda.")))
                            .switchIfEmpty(Mono.just(user));
                })
                .flatMap(user -> {
                    user.setEmail(request.getNewEmail());
                    user.setEmailVerified(false);
                    return userRepository.save(user)
                            .flatMap(saved -> verificationService.sendCode(saved.getId(), saved.getEmail(), VerificationType.EMAIL_VERIFICATION)
                                    .thenReturn(saved))
                            .map(UserProfileResponse::fromEntity);
                });
    }

    @Override
    public Mono<UserProfileResponse> updatePhone(UpdatePhoneRequest request) {
        return getCurrentUser()
                .flatMap(user -> {
                    if (request.getNewPhoneNumber().equals(user.getPhoneNumber())) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yeni numara eskisiyle aynı olamaz."));
                    }
                    return userRepository.findByPhoneNumber(request.getNewPhoneNumber())
                            .flatMap(existing -> Mono.<User>error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bu numara kullanımda.")))
                            .switchIfEmpty(Mono.just(user));
                })
                .flatMap(user -> {
                    user.setPhoneNumber(request.getNewPhoneNumber());
                    user.setPhoneVerified(false);
                    return userRepository.save(user)
                            .flatMap(saved -> verificationService.sendCode(saved.getId(), saved.getPhoneNumber(), VerificationType.PHONE_VERIFICATION)
                                    .thenReturn(saved))
                            .map(UserProfileResponse::fromEntity);
                });
    }

    @Override
    public Mono<Void> verifyEmail(VerifyCodeRequest request) {
        return getCurrentUser()
                .flatMap(user -> {
                    if (user.isEmailVerified()) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-posta zaten doğrulanmış."));
                    }
                    return verificationService.verifyCode(user.getId(), request.getCode(), VerificationType.EMAIL_VERIFICATION)
                            .flatMap(valid -> {
                                user.setEmailVerified(true);
                                return userRepository.save(user);
                            });
                })
                .then();
    }

    @Override
    public Mono<Void> resendEmailCode() {
        return getCurrentUser()
                .flatMap(user -> verificationService.sendCode(user.getId(), user.getEmail(), VerificationType.EMAIL_VERIFICATION));
    }

    @Override
    public Mono<Void> verifyPhone(VerifyCodeRequest request) {
        return getCurrentUser()
                .flatMap(user -> {
                    if (user.isPhoneVerified()) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Telefon numarası zaten doğrulanmış."));
                    }
                    return verificationService.verifyCode(user.getId(), request.getCode(), VerificationType.PHONE_VERIFICATION)
                            .flatMap(valid -> {
                                user.setPhoneVerified(true);
                                return userRepository.save(user);
                            });
                })
                .then();
    }

    @Override
    public Mono<Void> resendPhoneCode() {
        return getCurrentUser()
                .flatMap(user -> verificationService.sendCode(user.getId(), user.getPhoneNumber(), VerificationType.PHONE_VERIFICATION));
    }

    @Override
    public Mono<Void> deactivateAccount() {
        return getCurrentUser()
                .flatMap(user -> {
                    user.setEnabled(false);
                    return userRepository.save(user);
                })
                .then();
    }
}
