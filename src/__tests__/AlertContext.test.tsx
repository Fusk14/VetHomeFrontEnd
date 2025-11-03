// src/__tests__/AlertContext.test.tsx

import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AlertProvider, useAlert } from '../context/AlertContext'; 


describe('AlertContext', () => {

    beforeEach(() => {
        // Se asegura que los timers reales se restablezcan antes de cada test
        vi.useRealTimers();
    });

    // --- TEST DE CIERRE AUTOMÁTICO (TIMEOUT RESUELTO) ---
    test('la alerta se cierra automáticamente después del tiempo especificado', async () => {
        
        // 1. Activar temporizadores falsos
        vi.useFakeTimers(); 
        
        function TestAutoClose() {
            const { showAlert } = useAlert();
            // Disparar una alerta que dura 1000ms
            return <button onClick={() => showAlert('Alerta temporal', 'info', 1000)}>Mostrar Alerta</button>;
        }

        const { unmount } = render(
            <AlertProvider>
                <TestAutoClose />
            </AlertProvider>
        );
        const user = userEvent.setup();

        // 2. Disparar el evento
        await user.click(screen.getByText('Mostrar Alerta'));
        expect(screen.getByText('Alerta temporal')).toBeInTheDocument();

        // 3. Avanzar el tiempo simulado más allá de la duración de la alerta (1000ms + un poco)
        await vi.advanceTimersByTimeAsync(1100); 
        
        // 4. Esperar de forma asíncrona a que el DOM se actualice.
        await waitFor(() => {
            // Aserción: La alerta NO debe estar visible
            expect(screen.queryByText('Alerta temporal')).not.toBeInTheDocument();
        }, { timeout: 2000 }) 

        // 5. Limpieza
        vi.useRealTimers();
        unmount();
    }, 12000); // Timeout generoso para evitar fallas por lentitud.
});