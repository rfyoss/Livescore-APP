<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Match extends Model
{
    protected $table = 'matches';

    protected $fillable = [
        'id',
        'league_id',
        'home_team_id',
        'away_team_id',
        'match_date',
        'status',
        'home_score',
        'away_score'
    ];

    public $incrementing = false;

    /**
     * Relationship: Match belongs to Home Team
     */
    public function homeTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    /**
     * Relationship: Match belongs to Away Team
     */
    public function awayTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }
}
