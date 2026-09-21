package com.agrirent.service;

import com.agrirent.entity.Category;
import com.agrirent.entity.User;
import com.agrirent.exception.BadRequestException;
import com.agrirent.exception.NotFoundException;
import com.agrirent.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Map<String, Object>> getAll() {
        return categoryRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    public Map<String, Object> getById(Long id) {
        return toMap(categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found")));
    }

    @Transactional
    public Map<String, Object> create(String name, String description) {
        if (name == null || name.isBlank()) throw new BadRequestException("Category name is required");
        if (name.trim().length() > 50) throw new BadRequestException("Category name cannot exceed 50 characters");
        categoryRepository.findByNameIgnoreCase(name.trim())
                .ifPresent(c -> { throw new BadRequestException("Category with name '" + name.trim() + "' already exists"); });
        Category cat = Category.builder().name(name.trim()).description(description != null ? description.trim() : "").build();
        return toMap(categoryRepository.save(cat));
    }

    @Transactional
    public Map<String, Object> update(Long id, String name, String description) {
        Category cat = categoryRepository.findById(id).orElseThrow(() -> new NotFoundException("Category not found"));
        if (name != null) {
            if (name.isBlank()) throw new BadRequestException("Category name cannot be empty");
            if (name.trim().length() > 50) throw new BadRequestException("Category name cannot exceed 50 characters");
            categoryRepository.findByNameIgnoreCase(name.trim()).ifPresent(c -> {
                if (!c.getId().equals(id)) throw new BadRequestException("Category with name '" + name.trim() + "' already exists");
            });
            cat.setName(name.trim());
        }
        if (description != null) cat.setDescription(description.trim());
        return toMap(categoryRepository.save(cat));
    }

    @Transactional
    public void delete(Long id) {
        categoryRepository.findById(id).orElseThrow(() -> new NotFoundException("Category not found"));
        categoryRepository.deleteById(id);
    }

    private Map<String, Object> toMap(Category c) {
        return Map.of(
            "_id", c.getId(), "id", c.getId(),
            "name", c.getName(),
            "description", c.getDescription() != null ? c.getDescription() : "",
            "createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : "",
            "updatedAt", c.getUpdatedAt() != null ? c.getUpdatedAt().toString() : ""
        );
    }
}
