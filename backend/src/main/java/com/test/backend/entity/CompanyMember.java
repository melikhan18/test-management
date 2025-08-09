package com.test.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * CompanyMember entity representing the many-to-many relationship between users and companies.
 * Uses composite primary key (user_id, company_id).
 */
@Entity
@Table(name = "company_members", indexes = {
    @Index(name = "idx_company_member_role", columnList = "role"),
    @Index(name = "idx_company_member_joined", columnList = "joined_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(CompanyMember.CompanyMemberId.class)
public class CompanyMember {
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_company_member_user"))
    private User user;
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false, foreignKey = @ForeignKey(name = "fk_company_member_company"))
    private Company company;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private CompanyRole role;
    
    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;
    
    @PrePersist
    protected void onCreate() {
        if (joinedAt == null) {
            joinedAt = LocalDateTime.now();
        }
    }
    
    /**
     * Composite Primary Key class for CompanyMember entity.
     */
    public static class CompanyMemberId implements Serializable {
        private Long user;
        private Long company;
        
        public CompanyMemberId() {}
        
        public CompanyMemberId(Long user, Long company) {
            this.user = user;
            this.company = company;
        }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            CompanyMemberId that = (CompanyMemberId) o;
            return Objects.equals(user, that.user) && Objects.equals(company, that.company);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(user, company);
        }
    }
}
