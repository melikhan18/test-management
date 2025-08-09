package com.test.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Base entity class that provides common fields for all entities.
 * Contains id, creation timestamp, update timestamp, and soft delete functionality.
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @CreationTimestamp
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    /**
     * Checks if the entity is soft deleted.
     * @return true if the entity is deleted, false otherwise
     */
    public boolean isDeleted() {
        return deletedAt != null;
    }
    
    /**
     * Marks the entity as soft deleted by setting the deletedAt timestamp.
     */
    public void markAsDeleted() {
        this.deletedAt = LocalDateTime.now();
    }
    
    /**
     * Restores a soft deleted entity by clearing the deletedAt timestamp.
     */
    public void restore() {
        this.deletedAt = null;
    }
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
