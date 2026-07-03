package com.example.employee.service.imp;

import com.example.employee.dto.PerformanceDTO;
import com.example.employee.model.Performance;
import com.example.employee.repository.PerformanceRepository;
import com.example.employee.service.PerformanceService;
import com.example.employee.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PerformanceServiceImpl implements PerformanceService {

    private final PerformanceRepository performanceRepository;

    @Override
    public PerformanceDTO createPerformance(PerformanceDTO dto) {
        Performance performance = toEntity(dto);
        Performance saved = performanceRepository.save(performance);
        return toDTO(saved);
    }

    @Override
    public PerformanceDTO getPerformanceById(Long id) {
        Performance performance = performanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance not found with id: " + id));
        return toDTO(performance);
    }

    @Override
    public List<PerformanceDTO> getAllPerformances() {
        return performanceRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PerformanceDTO> getPerformancesByEmployee(Long employeeId) {
        return performanceRepository.findByEmployeeIdOrderByEvaluationDateDesc(employeeId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PerformanceDTO updatePerformance(Long id, PerformanceDTO dto) {
        Performance existing = performanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance not found with id: " + id));
        // Update fields
        existing.setScore(dto.getScore());
        existing.setComment(dto.getComment());
        existing.setPeriod(dto.getPeriod());
        existing.setLevel(dto.getLevel());
        existing.setEvaluatedByUserId(dto.getEvaluatedByUserId());
        existing.setEvaluationDate(dto.getEvaluationDate());
        // employeeId should not change, but if provided we respect it
        if (dto.getEmployeeId() != null) {
            existing.setEmployeeId(dto.getEmployeeId());
        }
        Performance saved = performanceRepository.save(existing);
        return toDTO(saved);
    }

    @Override
    public void deletePerformance(Long id) {
        if (!performanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Performance not found with id: " + id);
        }
        performanceRepository.deleteById(id);
    }

    // ----- mappers -----
    private PerformanceDTO toDTO(Performance performance) {
        PerformanceDTO dto = new PerformanceDTO();
        dto.setId(performance.getId());
        dto.setEmployeeId(performance.getEmployeeId());
        dto.setScore(performance.getScore());
        dto.setComment(performance.getComment());
        dto.setPeriod(performance.getPeriod());
        dto.setLevel(performance.getLevel());
        dto.setEvaluatedByUserId(performance.getEvaluatedByUserId());
        dto.setEvaluationDate(performance.getEvaluationDate());
        dto.setCreatedAt(performance.getCreatedAt());
        return dto;
    }

    private Performance toEntity(PerformanceDTO dto) {
        Performance p = new Performance();
        p.setEmployeeId(dto.getEmployeeId());
        p.setScore(dto.getScore());
        p.setComment(dto.getComment());
        p.setPeriod(dto.getPeriod());
        p.setLevel(dto.getLevel());
        p.setEvaluatedByUserId(dto.getEvaluatedByUserId());
        p.setEvaluationDate(dto.getEvaluationDate());
        // createdAt is handled by @PrePersist
        return p;
    }
}
