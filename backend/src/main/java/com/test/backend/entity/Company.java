package com.test.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Company entity representing companies in the test management system.
 * Extends BaseEntity to inherit id, createdAt, updatedAt, and deletedAt fields.
 */
@Entity
@Table(name = "companies", indexes = {
    @Index(name = "idx_company_name", columnList = "name"),
    @Index(name = "idx_company_owner", columnList = "owner_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company extends BaseEntity {
    
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false, foreignKey = @ForeignKey(name = "fk_company_owner"))
    private User owner;
}
