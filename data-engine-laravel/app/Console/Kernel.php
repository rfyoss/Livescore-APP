<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Jobs\SyncMatchesJob;
use App\Jobs\SyncStandingsJob;
use App\Jobs\SyncTeamsJob;
use App\Jobs\SyncPlayersJob;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // 1. Sync live match score events every minute
        $schedule->job(new SyncMatchesJob)->everyMinute();

        // 2. Sync league standings stats table hourly
        $schedule->job(new SyncStandingsJob)->hourly();

        // 3. Sync football rosters and clubs data daily
        $schedule->job(new SyncTeamsJob)->daily();
        $schedule->job(new SyncPlayersJob)->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
