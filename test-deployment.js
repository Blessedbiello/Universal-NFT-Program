const { Connection, PublicKey, Keypair, SystemProgram } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } = require('@solana/spl-token');

// Program constants
const PROGRAM_ID = new PublicKey('Gc1BJg4sYAYGnKBStAHLTdVRLR3fA7DPc7t9G7vjKa1i');
const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Connection to devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Test function to verify program is deployed
async function testProgramDeployment() {
    console.log('🚀 Testing Universal NFT Program Deployment');
    console.log('Program ID:', PROGRAM_ID.toString());
    
    try {
        // Get program account info
        const programInfo = await connection.getAccountInfo(PROGRAM_ID);
        
        if (programInfo) {
            console.log('✅ Program is deployed and accessible');
            console.log('Program Owner:', programInfo.owner.toString());
            console.log('Program Executable:', programInfo.executable);
            console.log('Program Data Length:', programInfo.data.length);
        } else {
            console.log('❌ Program not found');
            return false;
        }
        
        // Test RPC call to get program accounts (should return empty initially)
        const programAccounts = await connection.getProgramAccounts(PROGRAM_ID);
        console.log(`📊 Program has ${programAccounts.length} accounts`);
        
        return true;
    } catch (error) {
        console.error('❌ Error testing program:', error.message);
        return false;
    }
}

// Helper function to derive PDAs
function findProgramAddress(seeds, programId) {
    return PublicKey.findProgramAddressSync(seeds, programId);
}

// Test function to find program config PDA
async function testProgramConfigPDA() {
    console.log('\n🔍 Testing Program Config PDA');
    
    try {
        const PROGRAM_SEED = Buffer.from('universal_nft_program');
        const [programConfigPDA, bump] = findProgramAddress([PROGRAM_SEED], PROGRAM_ID);
        
        console.log('Program Config PDA:', programConfigPDA.toString());
        console.log('Bump:', bump);
        
        // Check if program config exists
        const configAccount = await connection.getAccountInfo(programConfigPDA);
        if (configAccount) {
            console.log('✅ Program Config exists');
            console.log('Config account data length:', configAccount.data.length);
        } else {
            console.log('⚠️  Program Config not initialized yet');
        }
        
        return programConfigPDA;
    } catch (error) {
        console.error('❌ Error testing program config PDA:', error.message);
        return null;
    }
}

// Main test function
async function runTests() {
    console.log('═══════════════════════════════════════');
    console.log('  Universal NFT Program Deployment Test');
    console.log('═══════════════════════════════════════');
    
    // Test 1: Program deployment
    const isDeployed = await testProgramDeployment();
    if (!isDeployed) {
        console.log('❌ Deployment test failed');
        return;
    }
    
    // Test 2: Program Config PDA
    const programConfigPDA = await testProgramConfigPDA();
    if (!programConfigPDA) {
        console.log('❌ PDA test failed');
        return;
    }
    
    console.log('\n🎉 All deployment tests passed!');
    console.log('✅ Program is successfully deployed to Solana devnet');
    console.log('✅ Program is accessible via RPC');
    console.log('✅ PDA derivation works correctly');
    
    console.log('\n📋 Next steps:');
    console.log('1. Initialize the program using initialize_program instruction');
    console.log('2. Test NFT minting functionality');
    console.log('3. Test cross-chain operations');
    
    console.log('\n🌐 Program deployed at:');
    console.log(`https://explorer.solana.com/address/${PROGRAM_ID.toString()}?cluster=devnet`);
}

// Run the tests
runTests().catch(console.error);