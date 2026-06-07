<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Standing extends Model
{
    protected $table = 'standings';

    protected $fillable = [
        'id',
        'league_id',
        'team_id',
        'played',
        'win',
        'draw',
        'loss',
        'goals_for',
        'goals_against',
        'points'
    ];

    /**
     * Relationship: Standing record belongs to a Team
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }
}
